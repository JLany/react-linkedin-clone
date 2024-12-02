// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, orderBy, onSnapshot, query } from "firebase/firestore"; // Firestore methods
import { auth, db, provider, signInWithPopup, storage } from '../firebase';
import { GET_POSTS, SET_LOADING_STATUS, SET_USER } from './actionType';

const POST_COLLECTION = 'posts';

export const setUser = (user) => ({
  type: SET_USER,
  user: user
});

export function signInAPI() {
  return async (dispatch) => {
    try {
      const payload = await signInWithPopup(auth, provider)
      dispatch(setUser(payload.user));
    }
    catch (error) {
      console.error(error);
      alert(error.message);
    };
  };
};

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await dispatch(setUser(user));
      }
    });
  };
};

export function signOutAPI() {
  return async (dispatch) => {
    try {
      await auth.signOut();
      await dispatch(setUser(undefined));
    }
    catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
};

export function setLoading(status) {
  return {
    type: SET_LOADING_STATUS,
    status: status,
  };
};

export function getPostsAPI() {
  return async (dispatch) => {
    const postsRef = collection(db, POST_COLLECTION); // Reference to the collection
    const postsQuery = query(postsRef, orderBy("actor.date", "desc")); // Add ordering

    // Listen to changes using onSnapshot
    onSnapshot(postsQuery, (snapshot) => {
      const payload = snapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID if needed
        ...doc.data(), // Spread document data
      }));

      console.log(payload);

      // Dispatch or process the payload as needed
      dispatch(setPosts(payload));
    });
  };
};

const setPosts = (posts) => ({
  type: GET_POSTS,
  posts: posts,
});

// Returns the url to the uploaded media.
const uploadMediaFile = async (media) => {
  // get the source url from my server
  const response = await fetch('http://localhost:8080/api/s3Url');
  const { url } = await response.json();

  // post the file directly to the s3 bucket
  await fetch(url, {
    method: 'PUT',   // this is the allowed method from the s3 user policy
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: media,
  });

  const mediaURL = url.split('?')[0];

  return mediaURL;
};

export const createPostAPI = (payload) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    console.log(payload);

    try {
      let imageDownloadURL = '';
      let videoDownloadURL = '';

      // If the payload contains an image, upload it.
      if (payload.image) {
        imageDownloadURL = await uploadMediaFile(payload.image);
      }

      // If the payload contains a video, upload it.
      if (payload.video) {
        videoDownloadURL = await uploadMediaFile(payload.video);
      }

      // Add the post to Firestore.
      const postDetails = {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        sharedImageURL: imageDownloadURL || null,
        sharedVideoURL: videoDownloadURL || null,
        comments: 0,
        description: payload.description,
      };

      await addDoc(collection(db, POST_COLLECTION), postDetails);

      console.log("Post successfully created:", postDetails);
    } catch (error) {
      console.error("Error creating post:", error);
    }

    dispatch(setLoading(false));
  };
};


// export const createPostAPI = (payload) => {
//   return async (dispatch) => {
//     console.log(payload);

//     try {
//       const promises = [];
//       let imageDownloadURL = '';
//       let videoDownloadURL = '';

//       // If the payload contains an image, upload it.
//       if (payload.image && false) {
//         const imageRef = ref(storage, `images/${payload.image.name}`);
//         const imageUploadTask = uploadBytesResumable(imageRef, payload.image);

//         promises.push(
//           new Promise((resolve, reject) => {
//             imageUploadTask.on(
//               "state_changed",
//               (snapshot) => {
//                 const progress =
//                   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log(`Image Upload Progress: ${progress}%`);
//               },
//               (error) => reject(error),
//               async () => {
//                 const url = await getDownloadURL(imageRef);
//                 imageDownloadURL = url;
//                 resolve();
//               }
//             );
//           })
//         );
//       }

//       // If the payload contains a video, upload it.
//       if (payload.video && false) {
//         const videoRef = ref(storage, `videos/${payload.video.name}`);
//         const videoUploadTask = uploadBytesResumable(videoRef, payload.video);

//         promises.push(
//           new Promise((resolve, reject) => {
//             videoUploadTask.on(
//               "state_changed",
//               (snapshot) => {
//                 const progress =
//                   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log(`Video Upload Progress: ${progress}%`);
//               },
//               (error) => reject(error),
//               async () => {
//                 const url = await getDownloadURL(videoRef);
//                 videoDownloadURL = url;
//                 resolve();
//               }
//             );
//           })
//         );
//       }

//       // Wait for all uploads to finish.
//       await Promise.all(promises);

//       // Add the post to Firestore.
//       const postDetails = {
//         actor: {
//           description: payload.user.email,
//           title: payload.user.displayName,
//           date: payload.timestamp,
//           image: payload.user.photoURL,
//         },
//         sharedImageURL: imageDownloadURL || null,
//         sharedVideoURL: videoDownloadURL || null,
//         comments: 0,
//         description: payload.description,
//       };

//       await addDoc(collection(db, "posts"), postDetails);

//       console.log("Post successfully created:", postDetails);
//     } catch (error) {
//       console.error("Error creating post:", error);
//     }
//   };
// };

import styled from 'styled-components';
import ImageWrapper from './ImageWrapper';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { createPostAPI } from '../actions';
import { Timestamp } from 'firebase/firestore';


const PostModal = ({
  toggleModal,
  user,
  createPost,
}) => {
  const [editorText, setEditorText] = useState('');
  const [shareImage, setShareImage] = useState('');
  const [shareImageURL, setShareImageURL] = useState('');
  const [shareVideo, setShareVideo] = useState('');
  const [videoLink, setVideoLink] = useState('');

  const handleClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    e.preventDefault();

    setEditorText('');
    setShareImage('');
    setVideoLink('');
    toggleModal(e);
  }

  const handleEditorChange = (e) => {
    e.preventDefault();
    setEditorText(e.target.value);

    // Dynamically adjust textarea height
    e.target.style.height = "auto"; // Reset height to calculate new scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  const handleImageChange = (e) => {
    e.preventDefault();

    // Validataion
    const image = e.target.files[0];

    console.log(image);
    if (!image) {
      alert(`invalid image, the file is ${typeof (image)}`);
      console.log(`invalid image, the file is ${typeof (image)}`);
      return;
    }

    setShareImageURL(URL.createObjectURL(image));
    setShareImage(image);
  }

  const handleVideoChange = (e) => {
    e.preventDefault();

    const video = e.target.files[0];
    console.log(video);

    if (!video) {
      alert(`invalid video, the video is ${typeof video}`);
      console.log(`invalid video, the video is ${typeof video}`);
      return;
    }

    setVideoLink(URL.createObjectURL(video));
    setShareVideo(video);
  }

  const toggleMedia = (e, media, setMedia) => {
    if (media) {
      // This is to prevent the label from propagating 
      // the click to its corresponding input field.
      e.preventDefault();

      console.log('trying to stop the bubble!');
      setMedia('');
    }
  }

  const handlePostClick = async (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;

    const payload = {
      image: shareImage,
      video: shareVideo,
      user: user,
      description: editorText,
      timestamp: Timestamp.now(),
    };

    try {
      toggleModal();
      await createPost(payload);
    } catch (error) {
      toggleModal();
      console.error(error);
    }
  }

  return (
    <Container onClick={(e) => handleClose(e)} >
      <Content >
        <Header>
          <h2>Create a post</h2>
          <button onClick={handleClose} >
            <img src="/images/close-icon.svg" alt="" />
          </button>
        </Header>
        <SharedContent>
          <UserInfo>
            {
              user?.photoURL
                ? <img src={user.photoURL} alt="" />
                : <img src="/images/user.svg" alt="" />
            }
            <span>
              {
                user?.displayName
                  ? user.displayName
                  : 'Name'
              }
            </span>
          </UserInfo>
          <Editor>
            <textarea value={editorText}
              onChange={handleEditorChange}
              placeholder="What do you want to talk about?"
              autoFocus={true}
            />
            <UploadImage>
              <input
                type="file"
                accept="image/gif, image/jpeg, image/png, image/jpg"
                name="image"
                id="image-input"
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e)}
              />
              {
                shareImageURL &&
                <ImageWrapper size="400px">
                  <img src={shareImageURL} alt="" />
                </ImageWrapper>
              }
              <input
                type="file"
                accept="video/mp4, video/mkv, video/*, video/x-m4v"
                onChange={handleVideoChange}
                style={{ display: 'none' }}
                id="video-input"
                name="video"
              />
              {
                videoLink &&
                <ReactPlayer
                  width="100%"
                  height="100%"
                  controls={true}
                  url={videoLink}
                />
              }

            </UploadImage>
          </Editor>
        </SharedContent>
        <SharedCreation>
          <AttachAssets>
            <AssetButton >
              <label htmlFor="image-input" onClick={(e) => toggleMedia(e, shareImage, setShareImage)}>
                <ImageWrapper>
                  <img src="/images/post-photo.png" alt="" />
                </ImageWrapper>
              </label>
            </AssetButton>
            <AssetButton>
              <label htmlFor="video-input" onClick={(e) => toggleMedia(e, videoLink, setVideoLink)}>
                <ImageWrapper>
                  <img src="/images/post-video.png" alt="" />
                </ImageWrapper>
              </label>
            </AssetButton>
          </AttachAssets>
          <ShareComment>
            <AssetButton>
              <ImageWrapper>
                <img src="/images/comment.png" alt="" />
                anyone
              </ImageWrapper>
            </AssetButton>
          </ShareComment>
          <PostButton disabled={editorText === ''}
            onClick={handlePostClick}
          >
            POST
          </PostButton>
        </SharedCreation>
      </Content>
      <a rel="noreferrer" target="_blank" href="https://icons8.com/icon/71200/close">
        Close
      </a> icon by
      < a rel="noreferrer" target="_blank" href="https://icons8.com" > Icons8</a >
    </Container >
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);

  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  max-height: 90%;
  background-color: white;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  button {
    height: 40px;
    width: 45px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    /* background-color: inherit; */
    border: none;

    img {
      width: 20px;
      height: 20px;
    }

    svg,img {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
`;

const AttachAssets = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;

  ${AssetButton} {
    width: 40px;
  }
`;

const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);

  ${AssetButton} {
    padding-left: 28px;
    min-width: 85px;

    img {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${props => props.disabled ? 'rgba(0,0,0,0.8)' : '#0a66c2'};
  color: white;

  &:hover {
    background: ${props => props.disabled ? 'rgba(0,0,0,0.8)' : '#004182'};
  }
`;

const Editor = styled.div`
  padding: 12px 24px;
  
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    max-height: 745px;
    font-size: 16px;
    margin-bottom: 20px;
    border: none;
    outline: none;
    overflow: hidden;
  }
`;

const UploadImage = styled.div`
  text-align: center;

  & img {
    width: 100%;
  }
`;

const mapStateToProps = (state) => ({
  user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({
  createPost: (payload) => dispatch(createPostAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);


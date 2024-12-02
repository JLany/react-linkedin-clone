import styled from 'styled-components';
import PostModal from './PostModal';
import ImageWrapper from './ImageWrapper'
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getPostsAPI } from '../actions';
import ReactPlayer from 'react-player';

const Main = (props) => {
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const f = async () => {
      await props.getPosts();
    };

    f();
  }, []);

  const toggleModal = () => {
    setShowPostModal(!showPostModal);
  }

  return (
    <Container>
      <SharePostBox>
        <div>
          {
            props.user?.photoURL
              ? <img src={props.user.photoURL} alt="" />
              : <img src="/images/user.svg" alt="" />
          }
          <button
            onClick={() => toggleModal()}
            disabled={props.loading}
          >Start a post</button>
        </div>
        <div>
          <button>
            <ImageWrapper>
              <img src="/images/post-photo.png" alt="" />
            </ImageWrapper>
            <span>Photo</span>
          </button>

          <button>
            <ImageWrapper>
              <img src="/images/post-video.png" alt="" />
            </ImageWrapper>
            <span>Video</span>
          </button>

          <button>
            <ImageWrapper>
              <img src="/images/post-event.png" alt="" />
            </ImageWrapper>
            <span>Event</span>
          </button>

          <button>
            <ImageWrapper>
              <img src="/images/post-article.png" alt="" />
            </ImageWrapper>
            <span>Write article</span>
          </button>
        </div>
      </SharePostBox>

      {
        props.posts?.length === 0
          ? <p>There no posts yet!</p>
          :
          <Content>
            {
              props.loading &&
              <img src="/images/spin-loading.svg" alt="" />
            }

            {
              props.posts?.map((post, key) => (
                <Article key={key}>
                  <SharedActor>
                    <a>
                      {
                        !post.actor?.image
                          ? <img src="/images/user.svg" alt="" />
                          : <img src={post.actor.image} alt="" />
                      }
                      <div>
                        <span>{post.actor.title}</span>
                        <span>{post.actor.description}</span>
                        <span>{post.actor.date.toDate().toLocaleDateString()}</span>
                      </div>
                    </a>
                    <button>
                      <ImageWrapper size="30px">
                        <img src="/images/elipsis.png" alt="" />
                      </ImageWrapper>
                    </button>
                  </SharedActor>

                  <Description>
                    {post.description}
                  </Description>

                  <SharedImage>
                    <a>
                      {
                        post.sharedImageURL &&
                        <img src="/images/shared-image.jpg" alt="" />
                      }
                      {
                        post.sharedVideoURL &&
                        <ReactPlayer
                          controls={true}
                          url={post.sharedVideoURL}
                        />
                      }
                    </a>
                  </SharedImage>

                  <SocialCounts>
                    <li>
                      <button>
                        <img src="/images/like-button.svg" alt="" />
                        <img src="/images/celebrate-button.svg" alt="" />
                        <span>75</span>
                      </button>
                    </li>
                    <li>
                      {
                        post.comments === 0 
                          ? <></>
                          : post.comments === 1 
                            ? <a>{post.comments} comment</a>
                            : <a>{post.comments} comments</a>
                      }
                    </li>
                  </SocialCounts>

                  <SocialActions>
                    <button>
                      <ImageWrapper>
                        <img src="/images/like.png" alt="" />
                      </ImageWrapper>
                      <span>Like</span>
                    </button>
                    <button>
                      <ImageWrapper>
                        <img src="/images/comment.png" alt="" />
                      </ImageWrapper>
                      <span>Comments</span>
                    </button>
                    <button>
                      <ImageWrapper>
                        <img src="/images/share.png" alt="" />
                      </ImageWrapper>
                      <span>Share</span>
                    </button>
                    <button>
                      <ImageWrapper>
                        <img src="/images/send.png" alt="" />
                      </ImageWrapper>
                      <span>Send</span>
                    </button>
                  </SocialActions>
                </Article>
              ))
            }
            <Article>
              <SharedActor>
                <a>
                  <img src="/images/user.svg" alt="" />
                  <div>
                    <span>Title</span>
                    <span>Info</span>
                    <span>Date</span>
                  </div>
                </a>
                <button>
                  <ImageWrapper size="30px">
                    <img src="/images/elipsis.png" alt="" />
                  </ImageWrapper>
                </button>
              </SharedActor>

              <Description>
                Very great post by the way.
                I love that this is working!
              </Description>

              <SharedImage>
                <a>
                  <img src="/images/shared-image.jpg" alt="" />
                </a>
              </SharedImage>

              <SocialCounts>
                <li>
                  <button>
                    <img src="/images/like-button.svg" alt="" />
                    <img src="/images/celebrate-button.svg" alt="" />
                    <span>75</span>
                  </button>
                </li>
                <li>
                  <a>2 comments</a>
                </li>
              </SocialCounts>

              <SocialActions>
                <button>
                  <ImageWrapper>
                    <img src="/images/like.png" alt="" />
                  </ImageWrapper>
                  <span>Like</span>
                </button>
                <button>
                  <ImageWrapper>
                    <img src="/images/comment.png" alt="" />
                  </ImageWrapper>
                  <span>Comments</span>
                </button>
                <button>
                  <ImageWrapper>
                    <img src="/images/share.png" alt="" />
                  </ImageWrapper>
                  <span>Share</span>
                </button>
                <button>
                  <ImageWrapper>
                    <img src="/images/send.png" alt="" />
                  </ImageWrapper>
                  <span>Send</span>
                </button>
              </SocialActions>
            </Article>
          </Content>
      }

      {
        showPostModal &&
        <PostModal toggleModal={toggleModal} />
      }

    </Container>
  );
};

const Container = styled.div`
  grid-area: main; 
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const SharePostBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }

    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }

      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;
      }
    }

    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      
      button {
        ${ImageWrapper} {
          img {
          margin: 0 4px 0 -2px;
        }
      }
        
        span {
          color: #70b5f9;
        }
      }
    }
  }
`;

const Content = styled.div`
  text-align: center;

  & > img {
    width: 30px;
    border-radius: 50%;
    margin-top: 5px;
    margin-bottom: 8px;
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  margin-top: 12px;
  overflow: visible;
`;

const SharedActor = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding-right: 40px;
  padding: 12px 16px 0;
  margin-bottom: 8px;

  a {
    display: flex;
    flex-grow: 1;
    margin-right: 12px;
    overflow: hidden;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
    }

    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;

      span {
        text-align: left;
        
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }

        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }

    }
  }

  button {
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

const SharedImage = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;

  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;

  li {
    margin-right: 5px;
    font-size: 12px;

    button {
      display: flex;
      border: none;
      background-color: inherit;
    }
  }
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;

  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #0a66c2;
    border: none;
    background-color: inherit;
    margin-right: 15px;

    span {
      margin-left: 5px;
    }

    @media (min-width: 768px) {
      span {
        margin-left: 8px;
      }
    }
  }
`;

const mapStateToProps = (state) => ({
  user: state.userState.user,
  loading: state.postState.loading,
  posts: state.postState.posts,
});

const mapDispatchToProps = (dispatch) => ({
  getPosts: async () => await dispatch(getPostsAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

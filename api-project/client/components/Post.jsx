import React, { useState, useContext, createContext, useEffect } from "react";
import { useNavigate,useParams, useLocation } from "react-router-dom";
import { fetchData } from "../js-files/GeneralRequests";
import '../css/post.css';
import { PostsContext } from "./Posts";
import { userContext } from "./App";
import Update from "./Update";
import Comment from "./Comment";
import Delete from "./DeleteItem";
import AddItem from "./AddItem";
import useHandleDisplay from "./useHandleDisplay";
import useHandleError from "./useHandleError";
export const CommentContext = createContext();
function Post({ post }) {
    const navigate = useNavigate();
    const { id, postid } = useParams();
    const [showPost, setShowPost] = useState(postid == post.id ? true : false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments, updateComments, deleteComments, addComments] = useHandleDisplay([]);
    const { updatePosts, deletePosts, setDisplayChanged } = useContext(PostsContext);
    const { userData } = useContext(userContext);
    const location = useLocation();
    const { handleError } = useHandleError();
    
    const attributes = ["name", "body"];
    
    function showPostFunction() {
        setShowPost(true);
        navigate(`/users/${id}/posts/${post.id}`);
    }
    useEffect(() => {
        (async function () {
            const hasPath = location.pathname.includes("comments");
            if (hasPath && post.id == postid) {
                if (comments.length > 0) {
                    setShowComments(true);
                }
                else {
                    let response = await fetchData("comments", "postId", post.id, handleError);
                    if (response) {
                        setComments(response);
                        setShowComments(true);
                    }
                }
            }

        })();
    }, [location.pathname, comments])
    function navigateToComments() {
        navigate(`/users/${id}/posts/${post.id}/comments`);
    }
    return (
        <>
            {!showPost && (
                <div className="postContainer">
                    <p>{post.id}</p>
                    <p>{post.title}</p>
                    <div className="actions">
                        <div className="right-actions">
                            {post.userId == userData.id && (
                                <>
                                    <Update
                                        item={{ id: post.id, title: post.title, body: post.body }}
                                        type="posts"
                                        updateDisplay={updatePosts}
                                        setDisplayChanged={setDisplayChanged}
                                    />
                                    <Delete
                                        id={post.id}
                                        type="posts"
                                        deleteDisplay={deletePosts}
                                        setDisplayChanged={setDisplayChanged}
                                        dependent="comments"
                                    />
                                </>
                            )}
                        </div>
                        <button onClick={showPostFunction}>Show Post</button>
                    </div>
                </div>
            )}

            {showPost && (
                <div className="overlay">
                    <div className="postContainer modal">
                        <button
                            className="close-button"
                            onClick={() => {
                                setShowPost(false);
                                setShowComments(false);
                                navigate(`/users/${id}/posts`);
                            }}
                        >
                            x
                        </button>
                        <h6 className="postTitle">{post.title}</h6>
                        <p className="postData">{post.body}</p>
                        <div className="actions">
                            <div className="actions-btn">
                                {!showComments && <button onClick={navigateToComments}>Show Comments</button>}
                                <CommentContext.Provider value={{ updateComments, deleteComments }}>
                                    <div> <AddItem keys={attributes} type="comments" addDisplay={addComments} defaltValues={{ email: userData.email, postId: post.id }} />{
                                        showComments && <div className="comment-container">{comments.map((comment) => { return <Comment key={comment.id} comment={comment}></Comment> })}
                                        </div>
                                    }</div></CommentContext.Provider>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default Post;

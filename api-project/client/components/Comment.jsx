import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Update from "./Update";
import Delete from "./DeleteItem";
import "../css/comment.css";
import { CommentContext } from "./Post";
import { userContext } from "./App";
function Comment({ comment }) {
    const { id } = useParams();
    const { userData } = useContext(userContext);
    const { updateComments, deleteComments } = useContext(CommentContext)
    return (
        <div className="comment-div">
            <p className="comment-email">{comment.email}</p>
            <p className="comment-name">{comment.name}</p>
            <p className="comment-body">{comment.body}</p>
            {userData.email == comment.email && <div className="comment-actions">
                <Update item={{ id: comment.id, name: comment.name, body: comment.body }} type="comments" updateDisplay={updateComments} />
                <Delete id={comment.id} type="comments" deleteDisplay={deleteComments} />
            </div>}
        </div>
    );
}

export default Comment;

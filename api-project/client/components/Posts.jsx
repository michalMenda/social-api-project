import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Post from "./Post";
import AddItem from "./AddItem";
import { fetchData } from "../js-files/GeneralRequests";
import useHandleDisplay from "./useHandleDisplay";
import useHandleError from "./useHandleError";
import Search from "./Search";
import "../css/post.css";

export const PostsContext = createContext();

function Posts({ id }) {
  const [showPosts, setShowPosts] = useState(true); // ברירת מחדל – להראות את כולם
  const [displayChanged, setDisplayChanged] = useState(false);
  const [posts, setPosts, updatePosts, deletePosts, addPosts] = useHandleDisplay([]);
  const { handleError } = useHandleError();
  const navigate = useNavigate();
  const postAttributes = ["title", "body"];

  const fetchPosts = async (user_id = "") => {
    const fetchedPosts = await fetchData("posts", "user_id", user_id, handleError);
    setPosts(fetchedPosts);
  };

  useEffect(() => {
    fetchPosts(); // כל הפוסטים כברירת מחדל
  }, [id]);

  const togglePosts = async () => {
    const newShowPosts = !showPosts;
    const user_id = newShowPosts ? "" : 'null'; // אם true → כל הפוסטים, אם false → שלי
    navigate(`/users/${id}/posts`);
    await fetchPosts(user_id);
    setShowPosts(newShowPosts);
  };

  return (
    <PostsContext.Provider value={{ updatePosts, deletePosts, displayChanged, setDisplayChanged }}>
      <div>
        <Search
          type="posts"
          searchItems={["id", "title"]}
          setItems={setPosts}
          items={posts}
          displayChanged={displayChanged}
          setDisplayChanged={setDisplayChanged}
        />
        <button className="show-posts" onClick={togglePosts}>
          {showPosts ? "Show My Posts" : "Show All Posts"}
        </button>
        <AddItem
          key="posts"
          keys={postAttributes}
          type="posts"
          addDisplay={addPosts}
          setDisplayChanged={setDisplayChanged}
          defaltValues={{ user_id: 'null' }}
        />
        {posts && posts.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </PostsContext.Provider>
  );
}


export default Posts;

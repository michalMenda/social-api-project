import React, { useState, useEffect, useContext } from "react";
import {
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  Navigate,         
} from "react-router-dom";
import UserData from "./UserData";
import Posts from "./Posts";
import Todos from "./todos";
import "../css/UserPage.css";
import { userContext } from "./App";
import Cookies from "js-cookie";

function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(userContext);

  const [isVisible, setIsVisible] = useState(false);

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <div className="nav-container">
        <nav className="left-nav">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              toggleVisibility();
            }}
          >
            Info
          </a>
        </nav>
        <nav className="center-nav">
          <Link to={`/users/${userData.id}/posts`}>Posts</Link>
          <span className="separator"></span>
          <Link to={`/users/${userData.id}/todos`}>Todos</Link>
        </nav>
        <nav className="right-nav">
          <Link
            to="/login"
            onClick={() => {
              localStorage.removeItem("currentUser");
              Cookies.remove("accessToken");
              setUserData(null);
            }}
          >
            Logout
          </Link>
        </nav>
      </div>

      {isVisible && (
        <div className="overlay">
          <UserData id={userData.id} onClose={toggleVisibility} />
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className="animated-title">
                Welcome to {userData.username}'s Dashboard
              </div>
              <h1 className="welcome-message">
                Welcome to our website!, your one-stop platform for managing
                todos, sharing posts, engaging with comments, and viewing user
                data! Whether you're staying organized, expressing your
                thoughts, or browsing memories, we've got you covered.
              </h1>
            </div>
          }
        />
        <Route path="/info" element={<UserData id={userData.id} />} />
        <Route path="/posts" element={<Posts id={userData.id} />} />
        <Route path="/posts/:postid" element={<Posts id={userData.id} />} />
        <Route path="/posts/:postid/*" element={<Posts id={userData.id} />} />
        <Route path="/todos" element={<Todos id={userData.id} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default UserPage;
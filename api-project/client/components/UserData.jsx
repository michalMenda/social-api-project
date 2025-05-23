import React, { useState, useEffect } from "react";
import { fetchData } from "../js-files/GeneralRequests";
import useHandleError from "./useHandleError";
import "../css/userData.css";

function UserData({ id, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useHandleError();
  useEffect(() => {
    const fetchUserData = async () => {
      let response = await fetchData("users", "id", id, handleError)
      if (response) {
        setUser(response[0]);
        setLoading(false);
      }

    }
    fetchUserData();
  }, [id])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-card">
      {onClose && (
        <button onClick={onClose} className="close-btn">
          X
        </button>
      )}
      <h1>{user.name} - Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default UserData;


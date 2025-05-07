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
      <h1>{user.name} Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <h2>Address</h2>
      <p><strong>Street:</strong> {user.address.street}</p>
      <p><strong>Suite:</strong> {user.address.suite}</p>
      <p><strong>City:</strong> {user.address.city}</p>
      <p><strong>Zipcode:</strong> {user.address.zipcode}</p>
      <p><strong>Latitude:</strong> {user.address.geo.lat}</p>
      <p><strong>Longitude:</strong> {user.address.geo.lng}</p>
      <h2>Phone & Website</h2>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Website:</strong> {user.website}</p>
      <h2>Company</h2>
      <p><strong>Company Name:</strong> {user.company.name}</p>
      <p><strong>Catchphrase:</strong> {user.company.catchPhrase}</p>
      <p><strong>BS:</strong> {user.company.bs}</p>
    </div>
  );
}

export default UserData;


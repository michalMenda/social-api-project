import React from "react";
import { FaTrash } from "react-icons/fa";
import '../css/Delete.css';
import useHandleError from "./useHandleError";

function Delete({ id, type, deleteDisplay, setDisplayChanged = () => {}, dependent }) {
    const { handleError } = useHandleError();

    const sendDeleteRequest = async (token) => {
        const url = dependent 
            ? `http://localhost:3000/${type}/${id}?dependent=${dependent}`
            : `http://localhost:3000/${type}/${id}`;

        return await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',
        });
    };

    const refreshToken = async () => {
        const res = await fetch('http://localhost:3000/refresh', {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) throw new Error("Failed to refresh token");

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
    };

    async function deleteItem() {
        let token = localStorage.getItem("accessToken");

        try {
            let response = await sendDeleteRequest(token);

            if (response.status === 401) {
                token = await refreshToken();
                response = await sendDeleteRequest(token);
            }

            if (response.ok) {
                deleteDisplay(id);
                setDisplayChanged(true);
            } else {
                throw new Error(`נכשל במחיקת ${type} עם מזהה: ${id}`);
            }
        } catch (error) {
            handleError("deleteError", error);
        }
    }

    return (
        <>
            <FaTrash className="delete-icon" onClick={deleteItem} />
        </>
    );
}

export default Delete;

import React from "react";
import { FaTrash } from "react-icons/fa";
import '../css/Delete.css';
import useHandleError from "./useHandleError";

function Delete({ id, type, deleteDisplay, setDisplayChanged = () => { }, dependent }) {
    const { handleError } = useHandleError();

    async function deleteItem() {
        try {
            // בניית ה-URL עם פרמטר התלות כפרמטר שאילתה אם הוא קיים
            const url = dependent 
                ? `http://localhost:3000/${type}/${id}?dependent=${dependent}`
                : `http://localhost:3000/${type}/${id}`;
                
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                deleteDisplay(id);
                setDisplayChanged(true);
            } else {
                throw new Error(`נכשל במחיקת ${type} עם מזהה: ${id}`);
            }
        }
        catch (error) {
            handleError("deleteError", error);
        }
    }

    return (
        <>
            <FaTrash className="delete-icon" onClick={deleteItem}></FaTrash>
        </>
    );
}

export default Delete;

import React, { useState } from "react";
import "../css/AddItem.css";
import useHandleError from "./useHandleError";
import refreshToken from "../js-files/refreshToken";
import Cookies from 'js-cookie';

function AddItem({ keys, type, addDisplay, defaltValues, setDisplayChanged = () => { } }) {
    const [showAddItem, setShowAddItem] = useState(false);
    const [item, setItem] = useState(defaltValues);
    const { handleError } = useHandleError();

    const handleInputChange = (key, value) => {
        setItem((prevItem) => ({ ...prevItem, [key]: value }));
    };

    const isFormValid = Object.values(item).some(
        (value) => typeof value === "string" && value.trim() !== ""
    );

    const sendAddRequest = async (token) => {
        return await fetch(`http://localhost:3000/${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include', 
            body: JSON.stringify(item),
        });
    };


    const addNewItem = async () => {
        if (!isFormValid) {
            alert("Please fill in at least one field before saving.");
            return;
        }

        let token = Cookies.get("accessToken");

        try {
            let response = await sendAddRequest(token);

            if (response.status === 401|| response.status === 403) {
                token = await refreshToken();
                response = await sendAddRequest(token);
            }

            if (!response.ok) {
                throw new Error("Failed to add item.");
            }

            const newItem = await response.json();
            addDisplay(newItem);
            setDisplayChanged(true);
            setItem(defaltValues);
            setShowAddItem(false);
        } catch (error) {
            handleError("addError", error); 
        }
    };

    return (
        <>
            <button className="add-item-button" onClick={() => setShowAddItem(true)}>
                {`Add ${type}`}
            </button>
            {showAddItem && (
                <div className="add-item-container">
                    {keys.map((key) => (
                        <div key={key} className="form-field">
                            <label htmlFor={key} className="form-label">
                                {key}:
                            </label>
                            <input
                                id={key}
                                placeholder={key}
                                value={item[key] || ""}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                className="form-input"
                            />
                        </div>
                    ))}
                    <div className="button-container">
                        <button className="send-button" onClick={addNewItem}>
                            Send
                        </button>
                        <button className="cancel-button" onClick={() => setShowAddItem(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddItem;

import React, { useState, useContext } from "react";
import { FaPen } from "react-icons/fa";
import "../css/Update.css"
import useHandleError from "./useHandleError";
function Update({ item, type, updateDisplay, setDisplayChanged = () => { } }) {
    const [showUpdateDetails, setShowUpdateDetails] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const { handleError } = useHandleError();
    const handleInputChange = (key, value) => {
        setUpdatedItem((prevItem) => ({
            ...prevItem,
            [key]: value,
        }));
    };

    async function updateItem() {
        const updatedData = { ...item, ...updatedItem };
        try {
            let response = await fetch(`http://localhost:3000/${type}/${item.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });
            if (response.ok) {
                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
            }
        } catch (ex) {
            handleError("updateError", ex);
        }
    }

    const handleCancel = () => {
        setUpdatedItem(item);
        setShowUpdateDetails(false);
    };

    return (
        <>
            <FaPen className="edit-icon" onClick={() => setShowUpdateDetails(true)} />
            {showUpdateDetails && (
                <div className="overlay">
                    <div className="modal">
                        <h2>Edit {type}</h2>
                        {Object.keys(updatedItem).map(
                            (key) =>
                                key !== "id" &&
                                (
                                    <div key={key} style={{ marginBottom: "10px" }}>
                                        <label
                                            htmlFor={key}
                                            style={{ display: "block", fontWeight: "bold" }}
                                        >
                                            {key}:
                                        </label>
                                        <input
                                            id={key}
                                            value={updatedItem[key]}
                                            placeholder={key}
                                            onChange={(e) =>
                                                handleInputChange(key, e.target.value)
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </div>
                                )
                        )}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            <button onClick={updateItem} className="btn-primary">
                                Update
                            </button>
                            <button onClick={handleCancel} className="btn-primary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Update;

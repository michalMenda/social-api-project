import React, { useContext } from "react"
import { FaTrash } from "react-icons/fa";
import '../css/Delete.css'
import useHandleError from "./useHandleError";
function Delete({ id, type, deleteDisplay, setDisplayChanged = () => { } , dependent }) {
    const {handleError}=useHandleError();
    async function deleteItem() {
        try {
            if (dependent) {
                let singularType = type.slice(0, -1);
                let dependentArrayResponse = await fetch(`http://localhost:3000/${dependent}/?${singularType}Id=${id}`);
                if (!dependentArrayResponse.ok) {
                    throw new Error(`Failed to fetch dependent data for ${dependent}`);
                }

                let dependentArray = await dependentArrayResponse.json();
                for (let element of dependentArray) {
                    let dependentResponse = await fetch(`http://localhost:3000/${dependent}/${element.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!dependentResponse.ok) {
                        throw new Error(`Failed to delete dependent ${dependent} with ID: ${element.id}`);
                    }
                }
            }
            let response = await fetch(`http://localhost:3000/${type}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                deleteDisplay(id);
                setDisplayChanged(true);
            }
        }
        catch (error) {
            handleError("deleteError",error);
        }
    }
    return (<>
        <FaTrash className="delete-icon" onClick={deleteItem}></FaTrash>
    </>

    )
}
export default Delete;
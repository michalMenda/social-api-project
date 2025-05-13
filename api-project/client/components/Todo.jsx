import React, { useState, useContext } from "react";
import '../css/todo.css';
import { DisplayContext } from "./todos"
import useHandleError from "./useHandleError";
import Update from "./Update";
import Delete from "./DeleteItem";
import refreshToken from "../js-files/refreshToken";
import Cookies from 'js-cookie';
function Todo({ todo }) {
    const [checked, setChecked] = useState(todo.completed);
    const { updateTodo, deleteTodo, setDisplayChanged } = useContext(DisplayContext);
    const [error, setError] = useState(null);
    const { handleError } = useHandleError();
    const handleCheckboxChange = async () => {
        const newCheckedState = !checked;
        setChecked(newCheckedState); // Optimistic UI update
        setError(null); // Clear previous errors
    
        let token = Cookies.get("accessToken");
    
        const sendRequest = async (accessToken) => {
            return await fetch(`http://localhost:3000/todos/${todo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: todo.title,
                    user_id: 'null',
                    is_active: todo.is_active,
                    completed: newCheckedState,
                }),
            });
        };
    
        try {
            let response = await sendRequest(token);
    
            if (response.status === 401|| response.status === 403) {
                token = await refreshToken(); 
                response = await sendRequest(token);
            }
    
            if (!response.ok) {
                throw new Error("Failed to update the todo status.");
            }
        } catch (err) {
            setChecked(!newCheckedState); // Revert state if API call fails
            handleError("getError", err);
        }
    };
    

    return (
        <div className="todo-container">
            <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                className="todo-checkbox"
            />
            <p className="todo-id">{todo.id}</p>
            <p className={`todo-title ${checked ? "completed" : ""}`}>{todo.title}</p>
            <Update
                item={{ id: todo.id, title: todo.title }}
                type="todos"
                updateDisplay={updateTodo}
                setDisplayChanged={setDisplayChanged}
            />
            <Delete
                id={todo.id}
                type="todos"
                deleteDisplay={deleteTodo}
                setDisplayChanged={setDisplayChanged}
            />
            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
}

export default Todo;

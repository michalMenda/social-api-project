import React, { useState,useContext} from "react";
import { useNavigate } from "react-router-dom";  
import '../css/login.css'
import { userContext } from "./App";
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {setUserData}= useContext(userContext);
    async function checkIFUserExists() {
        let response = await fetch(`http://localhost:3000/users/?username=${username}`);
        const user = await response.json();
        if (response.ok &&user[0]) {
            if (user.length > 0 && user[0].website === password) {
                const { website, ...userWithoutPassword } = user[0];
                setUserData(userWithoutPassword);
                localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
                navigate(`/home`);
            } else {
                alert('Incorrect password');
            }
        } else {
            alert('User doesn’t exist');
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    return (
        <div>
        <div className="login-container">
            <input
                name="username"
                placeholder="Username"
                className="login-input"
                onChange={handleUsernameChange} 
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                className="login-input"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-button" onClick={checkIFUserExists}>
                Login
            </button>
        </div>
        <button className="switch-signup" onClick={()=>navigate('/register')}>don't have an account yet?</button>
        </div>
    );
}

export default Login;

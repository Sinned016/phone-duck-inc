import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [ inputValues, setInputValues ] = useState({
        username: "",
        password: ""
    })


    function handleChange(event) {
        const { name, value } = event.target;

        setInputValues((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    async function handleLogin() {
        const LOGIN_URL = "http://127.0.0.1:6060/ducks/api/login/"

        const loginData = {
            username: inputValues.username,
            password: inputValues.password
        }

        const fetchOption= {
            method: "PUT",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json", // Tell server to parse as json data
            }
        }
    
        const response = await fetch(LOGIN_URL, fetchOption);
        if(response.status === 200) {
            const authToken = await response.text()
    
            sessionStorage.setItem("x-auth-token", authToken); // Saves auth token for the duration of browser
        }
        
    }


    async function onLoginClick() {
        await handleLogin();

        const authToken = sessionStorage.getItem("x-auth-token")

        if (authToken === null ) {
            console.log("No auth token found")
            return false;
        } else {
            navigate("/home")
        }
    }

    function goToLogin() {
        navigate("/")
    }
  
    function goToCreate() {
        navigate("/create/account")
    }

    return(
        <div>
        <h1>Login page</h1>

        <div className="login-btn-container">
              <button onClick={goToLogin}>Login page</button>
              <button onClick={goToCreate}>Create Account</button>
        </div>

        <div>
            <label>Username</label>
            <input onChange={handleChange} name="username" value={inputValues.username} className="loginUsername" type="text" />
        </div>

        <div>
            <label>Password</label>
            <input onChange={handleChange} name="password" value={inputValues.password} className="loginPassword" type="password" />
        </div>

        <button onClick={onLoginClick} className="loginBtn">Login</button>

        
    </div>
    )
}

export default Login;
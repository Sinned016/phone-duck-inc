import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function CreateAccount() {
    const navigate = useNavigate();

    const [inputValues, setInputValues] = useState({
        username: "",
        password: ""
    });

    function handleChange(event) {
        const {name, value} = event.target;
        setInputValues((previnputValues) => {
            return {
                ...previnputValues,
                [name]: value //Säger ändra bara på denna variabel
            }
        })
    }

    function onCreateClick() {
        createAccount();
    }
    

    async function createAccount() {
        const CREATE_URL = "http://127.0.0.1:6060/ducks/api/create/account"

        const newUser = {
          username: inputValues.username,
          password: inputValues.password
        }

        const fetchOption= {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json", // Tell server to parse as json data
            }
        }
      

        let response = await fetch(CREATE_URL, fetchOption);
        console.log(response);
      

        if(response.status === 200) {
          console.log("Created account")
          navigate("/")
        } else {
          console.log("Bad request")
          alert("Try again")
        }
    }

    function goToLogin() {
        navigate("/")
    }

    function goToCreate() {
        navigate("/create/account")
    }

    return(
        <div className="account-page">
            <h1>Create account</h1>

            <div className="create-btn-container">
              <button onClick={goToLogin}>Login page</button>
              <button onClick={goToCreate}>Create Account</button>
            </div>

            <section className="create-field">
            <div className="username-field">
                <label for="">Username</label>
                <input onChange={handleChange} value={inputValues.username} name="username" type="text" className="create-username-field" required/>
            </div>

            <div className="password-field">
                <label for="">Password</label>
                <input onChange={handleChange} value={inputValues.password} name="password" type="password" className="create-password-field" required/>
            </div>
            
            <button onClick={onCreateClick} className="create-btn">Create account</button>
            </section>
        </div>
    );
}

export default CreateAccount;
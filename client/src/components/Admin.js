import React from "react";
import { useState } from "react";

export default function Admin() {

    const [ inputValues, setInputValues ] = useState({
        title: "",
        message: ""
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

    async function sendBroadcast() {
        const authToken = sessionStorage.getItem("x-auth-token")
        const SEND_BROADCAST_URL = "http://127.0.0.1:6060/ducks/api/broadcast/"

        const broadcastData = {
            title: inputValues.title,
            message: inputValues.message
        }

        const fetchOption= {
            method: "POST",
            body: JSON.stringify(broadcastData),
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json", // Tell server to parse as json data
            }
        }
    
        const response = await fetch(SEND_BROADCAST_URL, fetchOption);
        const result = await response.text()

        console.log(result)

        setInputValues({
            title: "",
            message: ""
        })
    }

    return(
        <div>
            <h2>Admin page</h2>

            <div>
            <h3>Create Broadcast</h3>
                <div className="broadcast-field">
                    <label>Title</label>
                    <input className="broadcast-input" onChange={handleChange} value={inputValues.title} name="title" type="text" />
                </div>
                <div className="broadcast-field">
                    <label>Message</label>
                    <textarea className="broadcast-textarea" onChange={handleChange} value={inputValues.message} name="message" type="text" />
                 </div>

                <button onClick={sendBroadcast}>Post Broadcast</button>
            </div>
        </div>
    )
}
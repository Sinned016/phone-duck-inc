import React from "react";
import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";


export default function Broadcasts() {

    const ref = useRef(false)

    // SOCKET.IO -->

    useEffect(() => {
        handleNewConnect()
    }, [])

    useEffect(() => {

        if(ref.current === false) {
            ref.current = true;

            console.log(socket)

            socket.on("new-connection", handleNewConnect);  
            socket.on("new-broadcast", handleNewConnect);
        }

    }, [])

    const [ broadcasts, setBroadcasts ] = useState(undefined)

    async function handleNewConnect(data) {
        console.log("new connection, woohoo");
        console.log(data);

        const authToken = sessionStorage.getItem("x-auth-token")
        const GET_BROADCAST_URL = "http://127.0.0.1:6060/ducks/api/broadcast/"

        const fetchOption = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        }

        const response = await fetch(GET_BROADCAST_URL, fetchOption)
        const result = await response.json()
        console.log(result)
        setBroadcasts(result)
    }
     // <-- SOCKET.IO 

    return (
        <div>
            <h2>Broadcasts</h2>

            {broadcasts && broadcasts.slice(0).reverse().map((broadcast) => {
                return(
                    <div>
                        <h4>{broadcast.title}</h4>
                        <p>{broadcast.message}</p>
                        <p>{broadcast.uploadedAt}</p>
                    </div>
                )
            })}
        </div>
    )
}
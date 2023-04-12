import React from "react";
import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";



export default function Home() {
    const [ channels, setChannels ] = useState(undefined)
    
    const [ renderChannel, setRenderChannel ] = useState(undefined)
    const [ message, setMessage ] = useState("")
    const [ number, setNumber ] = useState()
    const [ render, setRender ] = useState(true)
    const [ channelTitle, setChannelTitle ] = useState("")

    const ref = useRef(false)

    useEffect(() => {
        handleNewConnect()
    }, [])

    // SOCKET.IO -->
    useEffect(() => {

        if(ref.current === false) {
            ref.current = true;

            console.log(socket)

            socket.on("new-connection", handleNewConnect);  
            socket.on("new-channel", handleNewConnect);
            socket.on("new-message", handleNewConnect);
        }

    }, [])


    async function handleNewConnect(data) {
        console.log("new connection, woohoo");
        console.log("Id of current chatroom " + data);

        const authToken = sessionStorage.getItem("x-auth-token")

        const GET_CHANNELS_URL = "http://127.0.0.1:6060/ducks/api/channel/"

        const fetchOption = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        }

        const response = await fetch(GET_CHANNELS_URL, fetchOption)
        const result = await response.json()
        setChannels(result)
    }
    // <-- SOCKET.IO

    function parseJwt(token) {
        if (!token) {
          return;
        }
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    }
    


    function readChannel(event) {
        let i = event.target.getAttribute("value");
        setNumber(i)
        setRenderChannel(channels[i])

        setRender(!render)
    }


 // creating channel
    async function createChannel() {
        const authToken = sessionStorage.getItem("x-auth-token")
        const CREATE_CHANNEL_URL = "http://127.0.0.1:6060/ducks/api/channel/"

        const messageData = {
            title: channelTitle
        }

        const fetchOption = {
            method: "PUT",
            body: JSON.stringify(messageData),
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        }

        const response = await fetch(CREATE_CHANNEL_URL, fetchOption)
        const result = await response.json()
        console.log(result)

        setChannelTitle("");
    }


    function handleCreateChannel(event) {
        let value = event.target.value;

        setChannelTitle(value)
    }


    // handling messages
    async function sendMessage(event) {
        const authToken = sessionStorage.getItem("x-auth-token")
        const roomId = event.target.value
        const SEND_MSG_URL = `http://127.0.0.1:6060/ducks/api/channel/${roomId}`
        

        const messageData = {
            title: renderChannel.title,
            message: message
        }

        const fetchOption = {
            method: "POST",
            body: JSON.stringify(messageData),
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        }

        const response = await fetch(SEND_MSG_URL, fetchOption)
        const result = await response.json()
        console.log(result)

        setMessage("")
    }

    function handleMessage(event) {
        let value = event.target.value;

        setMessage(value)
    }

    
    // Deleteing channels
    async function deleteChannel(event) {
        let value = event.target.value;
        
        const DELETE_URL = `http://127.0.0.1:6060/ducks/api/channel/${channels[value]._id}`
        const authToken = sessionStorage.getItem("x-auth-token")

        const fetchOption = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        }

        const response = await fetch(DELETE_URL, fetchOption)
        console.log(response)
        
        console.log(DELETE_URL)
    }


    // Go back button, change the state so divs show and hide
    function goBack() {
        setRender(!render)
    }


    return (
        <div className="home-container">

            { render &&
            <div className="header-container">
                <h2>Channels</h2>

                <div className="create-channel-container">
                    <input className="create-channel-input" onChange={handleCreateChannel} value={channelTitle} type="text" placeholder="Channel Title" />
                    <button className="create-channel-btn" onClick={createChannel}>Create new channel</button>
                </div>
                
            </div>}
            

            {render && channels && channels.map((channel, index) => {
                return (
                    <div className="channel-container" key={index} >
                        
                        <div className="channel-field" onClick={readChannel} value={index}>
                            <h3 className="channel-title" value={index}>{channel.title}</h3>
                            <p className="channel-created-by" value={index}>Created by {channel.createdBy}</p>
                        </div>

                        <button onClick={deleteChannel} className="delete-btn" value={index}>Delete Channel</button>
                    </div>
                )
            })}

            {!render && renderChannel && 
            <div className="messageContainer"> 
                <button onClick={goBack}>Go back</button>
                <h3>{channels[number].title}</h3>
                
                <div className="chatContainer">
                {channels[number].messages.map((message, index) => {
                    const authToken = sessionStorage.getItem("x-auth-token");
                    let currentUser = parseJwt(authToken);
                    let sentFrom;
                    let sentFromContainer;
                    if (message.from === currentUser.username) {
                      sentFrom = "my-message";
                      sentFromContainer = "my-message-container";
                    } else {
                      sentFrom = "other-user-message";
                      sentFromContainer = "other-user-container";
                    }
                    
                    return (
                        <div className={sentFromContainer} key={index}>
                            <div className={sentFrom}>
                                <div>{message.from}</div>
                                <div>{message.message}</div>
                            </div>
                        </div>
                    )
                })}
                </div>

                <input className="message-input" type="text" value={message} onChange={handleMessage}/>
                <button value={channels[number]._id} className="send-message" onClick={sendMessage}>Send</button>
            </div>}

        </div>
    )
}
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    function navHome() {
        navigate("/home")
    }

    function navBroadcasts() {
        navigate("/broadcasts")
    }
    return(
        <nav className="navbar">
            <h1>Phone Duck inc</h1>

            <div className="navbtn-container">
                <button className="navbtn" onClick={navHome}>Home</button>
                <button className="navbtn" onClick={navBroadcasts}>Broadcasts</button> 
            </div>
            
        </nav>
    )
}
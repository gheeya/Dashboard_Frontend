import React from "react";
import './logoutButton.css'
import { useNavigate } from "react-router-dom";


const LogoutButton = () => {

    const navigate = useNavigate()

    const handleLogout = (e)=>{
        window.localStorage.removeItem("user_id")
        navigate('/')
    }

    return (
        <div className="logout-button-container" onClick={(e)=>{handleLogout(e)}}>
            <img src='/user.png' className="logout-button-image"></img>
            <span className="logout-button-span">Logout</span>
        </div>
    )
}

export default LogoutButton
import React, { useState } from "react";
import './login.css'
import { Button } from "react-bootstrap";
import FacebookIcon from '@mui/icons-material/Facebook';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import apiURL  from "../../../apiURL.js";
import { useNavigate } from "react-router-dom";


const Login = () =>{

    const navigate = useNavigate()
    const [userId, setUserId]=useState('')

    const handleUserIdChange = (e)=>{
        setUserId(e.target.value)
    }

    const handleLoginWithUserId = async (e) => {
        const userIdToSend = userId.trim()
        if(userIdToSend===""){
            toast.warn("User id cannot be empty")
            return
        }

        console.log(apiURL+'/api/auth/login')
        axios.post(apiURL+'/api/auth/login',{user_id:userIdToSend})
            .then((response)=>{
                window.localStorage.setItem("user_id",response.data.data.user_id)
                toast.success("User logged in successfully. Redirecting ...")
                setTimeout(()=>{
                    navigate('/app/home')
                },500)
            })
            .catch((err)=>{
                console.log(err)
                toast.warn(err.response.data.message)
            })
        
        
    }

    return (
        <>
        <div className="login-page">
            <div className="login-form-container">
                <h1 className="login-form-header">Verbalyze Chatter</h1>
                <input type="text" placeholder="Enter your user Id" className="login-input-field" onChange={(e)=>handleUserIdChange(e)}></input>
                <button className="login-btn-normal" onClick={(e)=>handleLoginWithUserId(e)}>Login with your userID</button>
                <button className="login-btn-fb"><FacebookIcon />Facebook Login</button>
            </div>
        </div>
        <ToastContainer />
        </>
    )
}

export default Login
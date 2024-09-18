import React, { useEffect, useState } from "react";
import './topbar.css'
import LogoutButton from "../logoutButton/logoutButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../apiURL";
import { toast } from "react-toastify";


const Topbar = ()=>{

    const navigate = useNavigate()
    const [userName, setUserName] = useState(null)

    useEffect(()=>{
        if(window.localStorage.getItem('user_id')){
            axios.get(apiURL + `/api/customers/${window.localStorage.getItem('user_id')}`)
                .then((response)=>{
                    setUserName(response.data.data.user.first_name + ' ' + response.data.data.user.last_name)
                })
                .catch((err)=>{
                    toast.warn("Error setting up ...")
                    navigate('/')
                })
        } else {
            navigate('/')
        }
    },[])


    const handleLogout = (e)=>{
        console.log("test")
    }

    return(
        <div className="topbar-container">
            <div className="user-details-display">Test User Name</div>
            <LogoutButton></LogoutButton>
        </div>
    )
}

export default Topbar
import React from "react";
import './staging.css'
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import Topbar from "../../components/topbar/topbar";



const Stage = () => {
    return (
        <div className="stage-container">
            <Sidebar />
            <Topbar />
            <div className="outlet-container">
                <Outlet />
            </div>
           
        </div>

    )
}


export default Stage
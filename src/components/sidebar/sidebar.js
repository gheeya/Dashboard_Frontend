import React from "react";
import './sidebar.css'
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import MessageIcon from '@mui/icons-material/Message';
import TelegramIcon from '@mui/icons-material/Telegram';
import { Link } from "react-router-dom";

const Sidebar = () =>{
    return (
        <div className="sidebar-container">
            <ul className="sidebar-list">
                <li className="sidebar-list-item">
                    <img className="sidebar-list-image" src='/logo.png' />
                </li>
                <li className="sidebar-list-item">
                    <Link to='home' className="sidebar-link">
                        <div className="sidebar-link-container">
                            <HomeIcon className="sidebar-link-icon" />
                            Home
                        </div>
                    </Link>
                </li>
                <li className="sidebar-list-item">
                    <Link to='contacts' className="sidebar-link">
                        <div className="sidebar-link-container">
                            <ContactsIcon className="sidebar-link-icon" />
                            Contacts
                        </div>
                    </Link>
                </li>
                <li className="sidebar-list-item">
                    <Link to='messaging' className="sidebar-link">
                        <div className="sidebar-link-container">
                            <MessageIcon className="sidebar-link-icon"></MessageIcon>
                            Messaging
                        </div>
                    </Link>
                </li>
                <li className="sidebar-list-item">
                    <Link to='templates' className="sidebar-link">
                        <div className="sidebar-link-container">
                            <TelegramIcon className="sidebar-link-icon" />
                            Templates
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar
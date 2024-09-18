import React, { useEffect, useRef, useState } from "react";
import './contactsTable.css'
import EditIcon from '@mui/icons-material/Edit';
import { Button } from "react-bootstrap";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContactsEditMenu from "../contactsEditMenu/contactsEditMenu";
import Popover from "../popover/popover";
import EditContactsForm from "../editContactsForm/editContactsForms";
import { cleanup } from "@testing-library/react";


const ContactsTable = (props) => {

    const ref = useRef(null)

    useEffect(()=>{
        window.addEventListener("resize",()=>{
            if(ref.current){
                props.setPopoverPosition({
                    top : ref.current.getBoundingClientRect().bottom,
                    left : ref.current.getBoundingClientRect().left - 150
                })
            }
           
        })
        window.addEventListener("scroll",()=>{
            if(ref.current){
                props.setPopoverPosition({
                    top : ref.current.getBoundingClientRect().bottom,
                    left : ref.current.getBoundingClientRect().left - 150
                })
            }
        })

        return () => {
            window.removeEventListener("resize",()=>{})
            window.removeEventListener("scroll",()=>{})
        }
    },[])

    const handleEditContactButtonClick = (e) => {
        props.setEditPopoverTrigger(!props.editPopoverTrigger)
        props.setContactData({
            _id : props.contacts[e.target.id]._id,
            first_name : props.contacts[e.target.id].first_name ? props.contacts[e.target.id].first_name : "",
            last_name : props.contacts[e.target.id].last_name ? props.contacts[e.target.id].last_name : "",
            phone : props.contacts[e.target.id].phone,
            country_code : props.contacts[e.target.id].country_code,
            email : props.contacts[e.target.id].email ? props.contacts[e.target.id].email : ""
        })
        props.setEditPopoverPosition({
            top : e.target.getBoundingClientRect().bottom,
            left : e.target.getBoundingClientRect().left - 250           
        })
    }

    const handleContacsEditMenuButtonClick = (e) => {
        props.setTrigger(!props.trigger)
        props.setPopoverPosition({
            top : e.target.getBoundingClientRect().bottom,
            left : e.target.getBoundingClientRect().left - 150
        })
    }
    

    const handleOnChange = (e) => {
        if(e.target.checked) {
            const newSelectedContactsSet = new Set(props.selectedContacts)
            newSelectedContactsSet.add(e.target.id)
            props.setSelectedContacts(newSelectedContactsSet)
        } else {
            const newSelectedContactsSet = new Set(props.selectedContacts)
            newSelectedContactsSet.delete(e.target.id)
            props.setSelectedContacts(newSelectedContactsSet)
        }
        
    }
    


    if (props.contacts) {
        if (props.contacts.length >= 0) {
            return (
            <div className="contacts-table-container">
                <table>
                    <thead>
                        <th>Sr. No</th>
                        <th>Select</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>
                            <div className="edit-menu">
                                More
                                <button ref={ref}className="more-options-button" onClick={(e) => handleContacsEditMenuButtonClick(e)}>
                                    <MoreVertIcon />
                                </button>
                            </div>
                        </th>
                    </thead>
                    <tbody>
                        {
                            props.contacts.map((val, idx) => {
                                val.first_name = val.first_name ? val.first_name : ""
                                val.last_name = val.last_name ? val.last_name : ""
                                val.email = val.email ? val.email : ""
                                return (
                                    <tr key={val._id}>
                                        <td>{idx + 1}</td>
                                        <td><input type="checkbox" id={val._id} onChange={(e)=>handleOnChange(e)}/></td>
                                        <td>{val.first_name}</td>
                                        <td>{val.last_name}</td>
                                        <td>{val.email}</td>
                                        <td>{val.country_code + val.phone}</td>
                                        <td><button id={idx} className="edit-icon" onClick={(e)=>{handleEditContactButtonClick(e)}}>Edit</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            )
        }

    }
}

export default ContactsTable
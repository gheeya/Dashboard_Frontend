import React, { useEffect } from "react";
import './contactOps.css'
import ContactsTable from "../../components/contactsTable/contactsTable";
import axios from "axios";
import { useState } from "react";
import apiURL from "../../apiURL";
import { ToastContainer,toast } from "react-toastify";
import Popover from "../../components/popover/popover";
import ContactsEditMenu from "../../components/contactsEditMenu/contactsEditMenu";
import EditContactsForm from "../../components/editContactsForm/editContactsForms";

const ContactOps = () => {

    const [propsForContactsTable, setPropsForContactsTable] = useState(null)
    const [trigger, setTrigger] = useState(false)
    const [popoverPosition, setPopoverPosition] = useState({top:0,left:0})
    const [editPopoverTrigger, setEditPopoverTrigger] = useState(false)
    const [contactData, setContactData] = useState(null)
    const [selectedContacts, setSelectedContacts] = useState(new Set([]))
    const [editPopoverPosition, setEditPopoverPosition] = useState({
        top:0,
        left:0
    })

    useEffect(()=>{
        async function fetchAndSetData() {
            axios.get(apiURL+`/api/contacts/for_user/${window.localStorage.getItem('user_id')}`)
                .then((response)=>{
                    const newProps = propsForContactsTable? propsForContactsTable : {}
                    newProps.contacts = response.data.data.contacts
                    console.log(newProps)
                    setPropsForContactsTable(newProps)
                    toast.success('Setting up contacts ...')
                })
                .catch((err)=>{
                    toast.warn(err.message)
                })
        }

        fetchAndSetData()
    },[])

    return (
        <div className="contactops-container">
            <ContactsTable {...propsForContactsTable} trigger={trigger} setTrigger={setTrigger} setPopoverPosition={setPopoverPosition} setContactData={setContactData} editPopoverTrigger={editPopoverTrigger} setEditPopoverTrigger={setEditPopoverTrigger} setEditPopoverPosition={setEditPopoverPosition} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}/>
            <Popover trigger={trigger} position={popoverPosition}>
                <ContactsEditMenu propsForContactsTable={propsForContactsTable} setPropsForContactsTable={setPropsForContactsTable} selectedContacts={selectedContacts}/>
            </Popover>
            <ToastContainer />
            <Popover trigger={editPopoverTrigger} setTrigger={setEditPopoverTrigger} type="full-screen">
                <EditContactsForm contactData={contactData} propsForContactsTable={propsForContactsTable} setPropsForContactsTable={setPropsForContactsTable} setEditPopoverTrigger={setEditPopoverTrigger} selectedContacts={selectedContacts}/>
            </Popover>
        </div>
    )
}

export default ContactOps
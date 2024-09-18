import React, { forwardRef, useEffect, useRef, useState } from "react";
import './contactsEditMenu.css'
import Popover from "../popover/popover";
import AddContactForm from "../addContactForm/addContactForm";
import ImportViaCSVForm from "../importViaCsvForm/importViaCsvForm";
import axios from "axios";
import apiURL from "../../apiURL";
import {toast} from 'react-toastify'
import {saveAs} from "file-saver";
import { fetchContacts } from "../../utils/contacts";
const ContactsEditMenu = (props) => {

    const ref = useRef(null)
    const refForElement = useRef(null)
    const [downloadLink,setDownloadLink] = useState(null)
    const [trigger, setTrigger] = useState({
        addContact : false,
        importContacts : false,
        exportToExcel : false
    })
    const [position, setPosition] = useState({
        top : 0,
        left : 0
    })


    useEffect(()=>{
        window.addEventListener("resize",()=>{
            if(ref.current){
                if(refForElement.current){
                    setPosition({
                        top : ref.current.getBoundingClientRect().bottom + 2,
                        left : ref.current.getBoundingClientRect().left + ref.current.getBoundingClientRect().width - refForElement.current.getBoundingClientRect().width
                    })
                }
            }
        })

        window.addEventListener("scroll",()=>{
            if(ref.current){
                if(refForElement.current){
                    setPosition({
                        top : ref.current.getBoundingClientRect().bottom + 2,
                        left : ref.current.getBoundingClientRect().left + ref.current.getBoundingClientRect().width - refForElement.current.getBoundingClientRect().width
                    })   
                }
            }
        })
        return ()=>{
            window.removeEventListener("resize",()=>{})
            window.removeEventListener("scroll",()=>{})
        }
    },[])


    const handleClick = (e) =>{
        if(e.target.id === "add_contact") {
            setTrigger({...trigger,addContact:!trigger.addContact,importContacts:false,exportToExcel:false})
            setPosition({
                top : document.getElementById("edit-container").getBoundingClientRect().bottom + 2,
                left : document.getElementById("edit-container").getBoundingClientRect().left + 32,
            })
        } else if(e.target.id === "import_contacts") {
            setTrigger({...trigger,addContact:false,importContacts:!trigger.importContacts,exportToExcel:false})
            setPosition({
                top : document.getElementById("edit-container").getBoundingClientRect().bottom + 2,
                left : document.getElementById("edit-container").getBoundingClientRect().left - 122,
            })

        } else if(e.target.id === "export_to_excel") {
            setTrigger({addContact:false,importContacts:false,exportToExcel:!trigger.exportToExcel})
            if(props.selectedContacts.size===0){
                toast.warn("Please select contacts")
                return
            }

            axios({
                url : apiURL + `/api/contacts/excel_for_user/${window.localStorage.getItem('user_id')}`,
                method : "get",
                params : {contacts:[...props.selectedContacts]},
                responseType: 'blob'
            })
            .then((response)=>{
                setDownloadLink(URL.createObjectURL(response.data))
            })
            .catch((err)=>{
                toast.warn(err.message)
            })

        } else if(e.target.id === "delete_selected_contacts") {
            const id=toast.loading("Deleting contacts ...")
            console.log(window.localStorage.getItem('user_id'))
            axios({
                url : apiURL + `/api/contacts/remove_many/${window.localStorage.getItem('user_id')}`,
                method : "delete",
                params : {
                   contacts : [...props.selectedContacts]
                }
            })
            .then((response)=>{
                toast.update(id,{render : "Contacts deleted successfully",autoClose:1500,isLoading:false,type:"success"})
                fetchContacts(props.propsForContactsTable,props.setPropsForContactsTable)
            })
            .catch((err)=>{
                console.log(err)
                toast.update(id,{render : "Contacts not deleted",autoClose:1500,isLoading:false,type:"error"})
            })
        }
    }

    const handleLinkClick = (e) =>{
        setTimeout(()=>{
            URL.revokeObjectURL(downloadLink)
            setDownloadLink(null)
        },3000)
    }

    return(
        <div ref={ref} className="contacts-edit-container" id="edit-container">
            <ul className="contacts-edit-menu-list">
                <li className="contacts-edit-menu-list-item" id="add_contact" onClick={(e)=>handleClick(e)}>Add Contact</li>
                <li className="contacts-edit-menu-list-item" id="import_contacts" onClick={(e)=>handleClick(e)}>Import Contacts via CSV</li>
                <li className="contacts-edit-menu-list-item" id="export_to_excel" onClick={(e)=>handleClick(e)}>
                    Export to excel
                    <br />
                    {downloadLink?<a href={downloadLink} download={"file.xlsx"} onClick={handleLinkClick}><button className="contacts-edit-menu-download-button">Download Contacts</button></a>:null}
                </li>
                <li className="contacts-edit-menu-list-item" id="delete_selected_contacts" onClick={(e)=>handleClick(e)}>
                    Delete Selected Contacts
                </li>
            </ul>
           <Popover trigger={trigger.addContact} position={position}>
                <AddContactForm ref={refForElement} propsForContactsTable={props.propsForContactsTable} setPropsForContactsTable={props.setPropsForContactsTable}/>
           </Popover>
           <Popover trigger={trigger.importContacts} position={position} >
                <ImportViaCSVForm ref={refForElement} propsForContactsTable={props.propsForContactsTable} setPropsForContactsTable={props.setPropsForContactsTable}/>
           </Popover>
          
        </div>
    )
}


export default ContactsEditMenu
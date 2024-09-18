import React, { useEffect } from "react";
import './templateOps.css'
import SenderAndReceiver from "../../components/templates/SenderAndReciever";
import TemplateDropDown from "../../components/templates/TemplateDropDown";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import apiURL from "../../apiURL";

const TemplateOps = () =>{

    const [phone,setPhone] = useState(null)
    const [contacts,setContacts] = useState(null)

    useEffect(()=>{
        (async ()=>{
          axios.get(apiURL + '/api/contacts/for_user'+`/${window.localStorage.getItem('user_id')}`)
            .then((response)=>{
              setContacts(response.data.data.contacts)
              toast.success("Ready to serve you")
            })
            .catch((err)=>{
              toast.warn("Oops error occured in setting up")
            })
        })()
      },[])

    return (
        <div className="container mt-3">
            <div><SenderAndReceiver contacts={contacts} phone={phone} setPhone={setPhone} /></div>
            <TemplateDropDown phone={phone}/>
            <ToastContainer />
        </div>
    )
}


export default TemplateOps
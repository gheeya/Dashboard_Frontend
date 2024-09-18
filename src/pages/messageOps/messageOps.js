import React, { useEffect, useState } from "react";
import './messageOps.css'
import MessageSelector from "../../components/messageSelector/messageSelector";
import axios from "axios";
import apiURL from "../../apiURL";
import {toast} from 'react-toastify'
import MessageSender from "../../components/messageSender/messageSender";

const MessageOps = () => {


    const [phoneNumbers, setPhoneNumbers] = useState([])
    const [contacts, setContacts] = useState([])
    const [renderMessageSender, setRenderMessageSender] = useState(false)

    const [messageTypes, setMessageTypes] = useState([
        "Normal Text",
        "Image",
        "testing"
    ])
    const [selectedConfig, setSelectedConfig] = useState({
        phoneNumberId : "-",
        toNumber : "-",
        messageType : "-"
    })

    useEffect(()=>{
        async function fetchPhoneNumbers() {
            axios.get(apiURL+`/api/customers/phone_numbers/${window.localStorage.getItem('user_id')}`)
                .then((response)=>{
                    setPhoneNumbers(response.data.data.phone_numbers)
                    console.log(response.data.data.phone_numbers)
                })
                .catch((err)=>{
                    toast.warn(err.response.data.message)
                })
        }

        async function fetchContacts() {
            axios.get(apiURL+`/api/contacts/for_user/${window.localStorage.getItem('user_id')}`)
            .then((response)=>{
                setContacts(response.data.data.contacts)
                console.log(response.data.data.contacts)
            })
            .catch((err)=>{
                toast.warn(err.message)
            })
        }

        fetchPhoneNumbers()
        fetchContacts()

    },[])


    useEffect(()=>{
        for(const key in selectedConfig){
            if(selectedConfig[key]==="-"){
                setRenderMessageSender(false)
                return
            }
        }
        setRenderMessageSender(true)

    },[selectedConfig])

    return(
        <div className="message-ops-container">
            <MessageSelector contacts={contacts} phoneNumbers={phoneNumbers} messageTypes={messageTypes} selectedConfig={selectedConfig} setSelectedConfig={setSelectedConfig}/>
            {renderMessageSender ? <MessageSender selectedConfig={selectedConfig} /> : null}
        </div>
    )
}

export default MessageOps
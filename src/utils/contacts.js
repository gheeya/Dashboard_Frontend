import axios from "axios"
import {toast} from 'react-toastify'
import apiURL from "../apiURL"

async function fetchContacts(propsForContactsTable,setPropsForContactsTable) {
    axios.get(apiURL+`/api/contacts/for_user/${window.localStorage.getItem('user_id')}`)
    .then((response)=>{
        const newProps = {}
        newProps.contacts = response.data.data.contacts
        console.log("Testing",newProps)
        setPropsForContactsTable(newProps)
    })
    .catch((err)=>{
        toast.warn(err.message)
    })
}

export {
    fetchContacts
}
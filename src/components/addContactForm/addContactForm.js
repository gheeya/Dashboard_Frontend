import React, { forwardRef } from "react";
import './addContactForm.css'
import { Button } from "react-bootstrap";
import {toast} from 'react-toastify'
import axios from "axios";
import apiURL from "../../apiURL";
import { fetchContacts } from "../../utils/contacts";


const AddContactForm = forwardRef((props,ref) => {

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const first_name = e.target.first_name.value
        const last_name = e.target.last_name.value
        const country_code = e.target.country_code.value
        const phone = e.target.phone.value
        const email = e.target.email.value

        if(country_code!=="" && !country_code.startsWith("+")) {
            toast.warn("Country code must start with + & must not be empty")
        } 

        console.log(phone)
        if(phone.length !== 10) {
            toast.warn("Phone number should be 10 digits only")
        } else {
            if(/[^0-9]/.test(phone)){
                toast.warn("Only numeric characters are allowed in phone number")
            } else {
                const id = toast.loading("Adding contact ...")
                axios.post(apiURL + '/api/contacts/insert',{
                    user_id : window.localStorage.getItem('user_id'),
                    contacts : [
                        {
                            first_name : first_name,
                            last_name : last_name,
                            country_code : country_code,
                            phone : phone,
                            email : email
                        }
                    ]
                })
                .then((response)=>{
                    toast.update(id,{render:`${response.data.message}`,type : "success",autoClose : 1500,isLoading: false})
                    fetchContacts(props.propsForContactsTable,props.setPropsForContactsTable)
                })
                .catch((err)=>{
                    toast.update(id,{render:`${err.response.data.error.detail}`,type : "error",autoClose : 1500, isLoading : false})
                })
            }
        }
    }

    return (
        <form ref={ref}className="contact-form-container" onSubmit={(e)=>handleFormSubmit(e)} method="POST">
            <input type="text" name="first_name" placeholder="Enter first name" className="contact-form-input"/>
            <input type="text" name="last_name" placeholder="Enter last name" className="contact-form-input"/>
            <input type="text" name="country_code" placeholder="Enter country code *" className="contact-form-input"/>
            <input type="text" name="phone" placeholder="Enter phone number *" className="contact-form-input"/>
            <input type="email" name="email" placeholder="Enter email id" className="contact-form-input" />
            <button type="submit" className="addcontact-button">Add Contact</button>
        </form>
    )
})

export default AddContactForm
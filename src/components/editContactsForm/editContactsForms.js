import React, { useEffect, useState } from 'react'
import './editContactsForm.css'
import { Button } from 'react-bootstrap'
import {toast} from 'react-toastify'
import apiURL from '../../apiURL'
import { fetchContacts } from '../../utils/contacts'
import axios from 'axios'
const _ = require('lodash')


const EditContactsForm = (props) => {

    const [dataChanged, setDataChanged] = useState(false)

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const newObject = {
            _id : props.contactData._id,
            first_name : e.target.first_name.value,
            last_name : e.target.last_name.value,
            country_code : e.target.country_code.value,
            phone : e.target.phone.value,
            email : e.target.email.value
        }

        console.log(newObject)
        console.log('-',props.contactData)
        if(_.isEqual(newObject,props.contactData)){
            toast.warn("Same as before")
        } else {
            if(newObject.country_code!=="" && !newObject.country_code.startsWith("+")) {
                toast.warn("Country code must start with + & must not be empty")
            } 
            if( newObject.phone.length !== 10) {
                console.log('here')
                toast.warn("Phone number should be 10 digits only")
            } else {
                if(/[^0-9]/.test(newObject.phone)){
                    toast.warn("Only numeric characters are allowed in phone number")
                } else {
                    const id = toast.loading("Updating contact ...")
                    axios.put(apiURL + '/api/contacts/update',{
                        contact : newObject
                    })
                    .then((response)=>{
                        toast.update(id,{render:`${response.data.message}`,type : "success",autoClose : 1500,isLoading: false})
                        fetchContacts(props.propsForContactsTable,props.setPropsForContactsTable)
                        setTimeout(()=>{
                            props.setEditPopoverTrigger(false)
                        },500)
                    })
                    .catch((err)=>{
                        toast.update(id,{render:`${err.response.data.error.detail}`,type : "error",autoClose : 1500, isLoading : false})
                    })
                }
            }
            
        }
        
    }

    const handleOnChange = (e) =>{
        console.log(e.target.value)
    }

    const handleDelete = (e) => {
        axios.delete(apiURL + `/api/contacts/remove/${window.localStorage.getItem('user_id')}/${props.contactData._id}`)
            .then((response)=>{
                toast.success("Contact deleted successfully.")
                fetchContacts(props.propsForContactsTable,props.setPropsForContactsTable)
                setTimeout(()=>{
                    props.setEditPopoverTrigger(false)
                },500)
            })
            .catch((err)=>{
                toast.warn(err.response.data.message)
            })
    }


    return (
        <form className='edit-contact-form-container' onSubmit={(e) => handleFormSubmit(e)} method='post'>
            <div className='edit-form-group'>
                <label>First Name</label>
                <input type="text" name="first_name" placeholder="Enter first name" className="edit-contact-form-input" defaultValue={props.contactData.first_name}/>
            </div>
            <div className='edit-form-group'>
                <label>Last Name</label>
                <input type="text" name="last_name" placeholder="Enter last name" className="edit-contact-form-input" defaultValue={props.contactData.last_name}/>
            </div>
            <div className='edit-form-group'>
                <label>Country Code</label>
                <input type="text" name="country_code" placeholder="Enter country code *" className="edit-contact-form-input" defaultValue={props.contactData.country_code}/>
            </div>
            <div className='edit-form-group'>
                <label>Phone Number</label>
                <input type="text" name="phone" placeholder="Enter phone number *" className="edit-contact-form-input" defaultValue={props.contactData.phone}/>
            </div>
            <div className='edit-form-group'>
                <label>Email Id</label>
                <input type="email" name="email" placeholder="Enter email id" className="edit-contact-form-input" defaultValue={props.contactData.email}/>
            </div>
            <button type="submit" className="edit-addcontact-button">Edit Contact</button>
            <button type="button" className="edit-deletecontact-button" onClick={(e)=>handleDelete(e)}>Delete Contact</button>
        </form>
    )

}

export default EditContactsForm
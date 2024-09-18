import React, { useState } from "react";
import './messageSelector.css'
const _ = require('lodash')

const MessageSelector = (props) => {


    const handleSelectChange = (e) => {
        
        
        const newObject = {
            phoneNumberId : e.target.name === "phone_number_id_select" ? e.target.value : props.selectedConfig.phoneNumberId,
            toNumber : e.target.name === "to_number_select" ? e.target.value : props.selectedConfig.toNumber,
            messageType : e.target.name === "message_type_select" ? e.target.value : props.selectedConfig.messageType
        }

        props.setSelectedConfig(newObject)
        console.log(newObject)
    }


    return (
        <div className="message-selector-container">
            <div className="message-component-container">
                <span>
                    From
                </span>
                <span>
                    <select name="phone_number_id_select" onChange={(e)=>{handleSelectChange(e)}}>
                        <option value="-">-</option>
                        {   props.phoneNumbers ?
                            props.phoneNumbers.map((val, idx) => {
                                return (
                                    <option key={val.id} value={val.id}>{`${val.verified_name} ${val.display_phone_number}`}</option>
                                )
                            })
                            : null
                        }
                    </select>
                </span>
            </div>

            <div className="message-component-container">
                <span>
                    To
                </span>
                <span>
                    <select name="to_number_select" onChange={(e)=>{handleSelectChange(e)}}>
                        <option value="-">-</option>
                        {   props.contacts ?
                            props.contacts.map((val, idx) => {
                                return (
                                    <option key={val._id} value={val.country_code + val.phone}>{`${val.first_name} ${val.last_name} ${val.country_code} ${val.phone}`}</option>
                                )
                            })
                            : null
                        }
                    </select>
                </span>
            </div>

            <div className="message-component-container" onChange={(e)=>{handleSelectChange(e)}}>
                <span>
                    Message Type
                </span>
                <span>
                    <select name="message_type_select">
                        <option value="-">-</option>
                        {   props.messageTypes ?
                            props.messageTypes.map((val, idx) => {
                                return (
                                    <option key={idx} value={idx}>{`${val}`}</option>
                                )
                            })
                            : null
                        }
                    </select>
                </span>
            </div>
        </div>
    )
}

export default MessageSelector
import React, { forwardRef, useState } from "react";
import './importViaCsvForm.css'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FormData from 'form-data'
import apiURL from "../../apiURL";
import { toast } from 'react-toastify'
import axios from "axios";
import { fetchContacts } from "../../utils/contacts";

const ImportViaCSVForm = forwardRef((props,ref) => {

    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChange =(e)=>{
        setSelectedFile(e.target.files[0])
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()

        if (!e.target.contacts_file.files[0]) {
            toast.warn("File cannot be empty")
            return
        } else {
            if (e.target.contacts_file.files[0].type.split('/').pop() !== "csv") {
                toast.warn("Please select only a csv file.")
                return
            }
            
            const form = new FormData()
            form.append("user_id",window.localStorage.getItem('user_id'))
            form.append("contacts_file",e.target.contacts_file.files[0])
            const id = toast.loading("Importing via CSV ...")
            axios.post(apiURL + "/api/contacts/insert_via_csv",form,{
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            })
            .then((response)=>{
                toast.update(id,{render:"Contacts added successfully",autoClose:500,isLoading:false,type:"success"})
                fetchContacts(props.propsForContactsTable,props.setPropsForContactsTable)
            })
            .catch((err)=>{
                toast.update(id,{render:`Contacts not added ${err.response.data.error.detail}`,autoClose:1500,isLoading:false,type:"error"})
            })
        }


    }

    return (
        <div ref={ref} className="import-csv-form-container">
            <form className="import-csv-form" onSubmit={handleFormSubmit} method="post">
                <div className="import-info-alert">! Contacts with empty country codes and/or phone number will be ignored.</div>
                <div className="import-info-alert">! Do not add + in front of the country codes.</div>
                <div className="import-info-alert">! Use plain .csv files without UTF-8 encoding.</div>
                <label for="files" className="import-csv-label">
                    <span>Select a file : {selectedFile? selectedFile.name :null}</span>
                    <InsertDriveFileIcon />
                </label>
                <input id="files" type="file" name="contacts_file" onChange={(e)=>{handleFileChange(e)}}/>
                <button type="submit" className="import-csv-button">Import CSV</button>
            </form>
        </div>
    )

})

export default ImportViaCSVForm

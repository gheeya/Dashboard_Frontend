import React, { useEffect, useRef, useState } from "react";
import './messageSender.css'
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import SendIcon from '@mui/icons-material/Send';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import apiURL from "../../apiURL";
import axios from "axios";
import FormData from "form-data";

const MessageSender = (props) => { 

    const textAreaRef = useRef(null)
    const [imagePath, setImagePath] = useState(null)
    const [selectedImage,setSelectedImage] = useState(null)
    const [caption, setCaption] = useState(null)
    const [textMessage, setTextMessage] = useState(null)

    useEffect(()=>{
        if(textAreaRef.current){
            console.log(textAreaRef.current)
            textAreaRef.current.style.height = "0px"
            const scrollHeight = textAreaRef.current.scrollHeight
            textAreaRef.current.style.height = scrollHeight + "px"
        }
    },[caption,textMessage])

    const handleSendImageWithCaption = (e) =>{
        e.preventDefault()
   
        if(!selectedImage) {
            toast.warn("Please select an image file")
        } else {
            const form = new FormData()
            form.append('image_file',selectedImage)
            form.append('user_id',window.localStorage.getItem('user_id'))
            form.append('to_phone_number',props.selectedConfig.toNumber.split('+').pop())
            form.append('phone_number_id',props.selectedConfig.phoneNumberId)
 
            if( caption !== null){
                if(caption !== '' ){
                    form.append('caption',caption)
                }
            }

            const id = toast.loading(`Sending message to ${props.selectedConfig.toNumber}`)

            axios.post(apiURL + '/api/messages/send_image',form,{headers :{'Content-Type':"multipart/form-data"}})
                .then((response)=>{
                    toast.update(id,{render:"Image sent successfully",autoClose:1500, isLoading:false,
                    onClose:()=>{
                        setImagePath(null)
                        setCaption(null)
                    }})

                })
                .catch((err)=>{
                    toast.update(id,{render : err.response.data.message,autoClose:1500, isLoading : false})
                })
        }
    }


    const handleSendText = (e) => {
        e.preventDefault()
        const textMessage = e.target.text_message.value
        if(textMessage===""){
            toast.warn("Empty messages are not allowed")
        } else {
            const id = toast.loading(`Sending message to ${props.selectedConfig.toNumber}`)
            axios.post(apiURL+'/api/messages/send_free_form_text',{
                user_id : window.localStorage.getItem('user_id'),
                to_phone_number : props.selectedConfig.toNumber.split('+').pop(),
                phone_number_id : props.selectedConfig.phoneNumberId,
                message_body : textMessage
            })
            .then((response)=>{
                toast.update(id,{render:"Message sent successfully",autoClose:1500, isLoading:false})
            })
            .catch((err)=>{
                toast.update(id,{render : err.response.data.message,autoClose:1500, isLoading : false})
            })
        }
    }



    const handleImageChanged = (e) =>{

        if(e.target.files.length > 1) {
            toast.warn("Please select only one file.")
        } else if (e.target.files.length === 1){
            if(! e.target.files[0].type.startsWith('image')) {
                toast.warn("Please select a file with image only")
                return
            }
            const image = e.target.files[0]
            setImagePath(URL.createObjectURL(e.target.files[0]))
            setSelectedImage(e.target.files[0])
        }
    }

    const handleCaptionChanged = (e)=>{
        setCaption(e.target.value.trim())
    }

    const handleTextMessageChanged=(e)=>{
        console.log(e.target.value)
        setTextMessage(e.target.value)
    }

    const handleSendImage = (e) => {
        e.preventDefault()
        if(e.target.image.files.length === 0) {
            toast.warn("Please select an image file")
        } else {
            const form = new FormData()
            form.append('image_file',e.target.image.files[0])
            form.append('user_id',window.localStorage.getItem('user_id'))
            form.append('to_phone_number',props.selectedConfig.toNumber.split('+').pop())
            form.append('phone_number_id',props.selectedConfig.phoneNumberId)

            const id = toast.loading(`Sending message to ${props.selectedConfig.toNumber}`)

            axios.post(apiURL + '/api/messages/send_image',form,{headers :{'Content-Type':"multipart/form-data"}})
                .then((response)=>{
                    toast.update(id,{render:"Image sent successfully",autoClose:1500, isLoading:false})
                })
                .catch((err)=>{
                    toast.update(id,{render : err.response.data.message,autoClose:1500, isLoading : false})
                })
        }
    }


    if(props.selectedConfig.messageType === "0") {
        
        return (
            <div className="message-sender-container">
                <ToastContainer />
                <form onSubmit={(e)=>handleSendText(e)} method="post" id="text_message" className="message-sender-form-text">
                    <div className="message-sender-form-group">
                        <label>Enter your message here : </label>
                        <textarea ref={textAreaRef} name="text_message" className="message-sender-text-area" onChange={(e)=>handleTextMessageChanged(e)}></textarea>
                    </div>
                    <button type="submit" className="message-sender-send-button"><SendIcon /></button>
                </form>
            </div>
        )
    }

    //Deprecated
    if(props.selectedConfig.messageType === "Never-match") {
        return (
            <div className="message-sender-container">
                <ToastContainer />
                <div className="message-sender-image-container">
                    <form onSubmit={(e)=>handleSendImage(e)} method="post" id="image" className="message-sender-form-image">
                        <div className="message-sender-form-group">
                            <label for="files" className="message-sender-select-image-label"><span> Select Image </span> <InsertPhotoIcon /> </label>
                            <input id="files" type="file" name="image" onChange={(e)=>handleImageChanged(e)} />
                        </div>
                        <button type="submit" className="message-sender-send-button"><SendIcon /></button>
                    </form>

                    {imagePath ?
                    <div className="message-sender-image-preview">
                        {imagePath ?  <img src={imagePath} alt="Image preview will appear here" />: null}
                    </div>
                    : null }
                </div>

                
            </div>
        )
    }

    if(props.selectedConfig.messageType === "1") {
        return (
            <div className="message-sender-container">
                <ToastContainer />
                <div className="message-sender-image-caption-container">
                    <div className="message-sender-image-caption-file-selector">
                        <form className="message-sender-form-image-caption">
                            <div className="message-sender-form-group">
                                <label for="files" className="message-sender-select-image-label"><span> Select Image </span> <InsertPhotoIcon /> </label>
                                <input id="files" type="file" name="image" onChange={(e)=>handleImageChanged(e)} />
                            </div>
                        </form>
                    </div>

                    <div className="message-sender-image-caption-preview">
                        {imagePath ?
                        <>
                            <div className="message-sender-image-caption-image-preview">
                                {imagePath ?  <img src={imagePath} alt="Image preview will appear here" className="message-sender-image-caption-image"/>: null}
                            </div>
                            <div className="message-sender-image-caption-image-caption">
                                <textarea ref={textAreaRef} name="caption" className="message-sender-caption-text-area" placeholder="Enter your caption here (optional)" onChange={(e)=>handleCaptionChanged(e)}></textarea>
                                <button type="button" className="message-sender-send-button" onClick={(e)=>handleSendImageWithCaption(e)}><SendIcon /></button>
                            </div>
                        </>
                        : null }
                    </div>
                </div>
            </div>
        )
    }


}

export default MessageSender
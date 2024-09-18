import React from "react";
import './popover.css'
import { Button } from "react-bootstrap";
import CloseIcon from '@mui/icons-material/Close';


const Popover = (props) => {

    const handleButtonClickFullScreen = (e) => {
        props.setTrigger(!props.trigger)
    }

    if(props.type==="full-screen"){
        return (
            <>
            {
                props.trigger ? 
                <div className="popover-container-full-screen">
                    <button className="popover-close-button" onClick={handleButtonClickFullScreen}><CloseIcon /></button>
                    <div className="popover-container-full-screen-inner">
                        {props.children}
                    </div>    
                </div>
                : null
            }
        </>
        )
    }

    return (
        <>
            {
                props.trigger ? 
                <div className="popover-container" style={props.position}>
                    {props.children}
                </div>
                : null
            }
        </>
    )

}


export default Popover
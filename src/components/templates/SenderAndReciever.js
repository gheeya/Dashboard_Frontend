import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import TemplateTable from "./TemplateTable";
import "./templates.css";
import apiURL from "../../apiURL";
import { ToastContainer, toast } from "react-toastify";

export default function SenderAndReceiver(props) {
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [templateData, setTemplateData] = useState({
    templateName: "",
    category: "AUTHENTICATION",
    templateHeader: "",
    templateBody: "",
    templateFooter: "",
  });

  const [showCallButtonFields, setShowCallButtonFields] = useState(false);
  const [showUrlButtonFields, setShowUrlButtonFields] = useState(false);
  const [callButtonName, setCallButtonName] = useState("");
  const [urlButtonName, setUrlButtonName] = useState("");
  const [url, setUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCreateTemplateClick = () => {
    setShowCreateModal(true);
  };

  const handleViewAllTemplatesClick = () => {
    setShowViewAllModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCloseViewAllModal = () => {
    setShowViewAllModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveTemplate = async () => {
    try {
      let updatedTemplateData = { ...templateData };
      if (showCallButtonFields) {
        updatedTemplateData = {
          ...updatedTemplateData,
          callButtonName,
          phoneNumber,
        };
      }
      if (showUrlButtonFields) {
        updatedTemplateData = {
          ...updatedTemplateData,
          urlButtonName,
          url,
        };
      }
      const response = await axios.post(apiURL+"/api/templates", {...updatedTemplateData,user_id:window.localStorage.getItem('user_id')}, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("RESPONSE FROM THE SERVER:", response.data);
      handleCloseCreateModal();
    } catch (error) {
      console.log("Error saving template:", error);
    }
  };
  

  const handlePhoneChange = (e) => {
    props.setPhone(e.target.id);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTemplateData({
      ...templateData,
      [name]: value,
    });
  };

  return (
    <div>
      <h4>Sender And Receiver Info</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Sender Number:</Form.Label>
          <Form.Control type="text" placeholder="+1 555 003 6363" readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <div className="dropdown">
            <button className="btn bg-transparent border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" id="dropdownMenuButton">
              Receiver Number
            </button>
            <Form.Control type="text" placeholder={props.phone ? props.phone : "No number selected"} readOnly />
            <ul className="dropdown-menu">
              {props.contacts
                ? props.contacts.map((val, idx) => {
                  return (
                    <li className="dropdown-item" onClick={(e) => handlePhoneChange(e)} key={val._id} id={val.country_code + val.phone}>
                      {`${val.first_name} ${val.last_name} ${val.country_code}${val.phone}`}
                    </li>
                  );
                })
                : null}
            </ul>
          </div>
        </Form.Group>
      </Form>
      <Button className="btn buttonTemp ms-2" onClick={handleCreateTemplateClick}>
        Create Template
      </Button>
      <Button className="btn buttonTemp ms-1" onClick={handleViewAllTemplatesClick}>
        View All Templates
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}></Modal>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Name:</Form.Label>
            <Form.Control type="text" placeholder="Enter template name" name="templateName" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Select Category:</Form.Label>
            <Form.Select name="category" onChange={handleInputChange}>
              <option value="AUTHENTICATION">AUTHENTICATION</option>
              <option value="MARKETING">MARKETING</option>
              <option value="UTILITY">UTILITY</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Header:</Form.Label>
            <Form.Control type="text" placeholder="Enter template Header" name="templateHeader" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Body:</Form.Label>
            <Form.Control as="textarea" style={{ height: "200px", width: "450px" }} name="templateBody" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Footer:</Form.Label>
            <Form.Control type="text" placeholder="Enter template Footer" name="templateFooter" onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="Call Button" onChange={(e) => setShowCallButtonFields(e.target.checked)} />
            {showCallButtonFields && (
              <>
                <Form.Label>Button Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter Button Name" onChange={(e) => setCallButtonName(e.target.value)} />
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control type="text" placeholder="Enter Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} />
              </>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="URL Button" onChange={(e) => setShowUrlButtonFields(e.target.checked)} />
            {showUrlButtonFields && (
              <>
                <Form.Label>Button Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter Button Name" onChange={(e) => setUrlButtonName(e.target.value)} />
                <Form.Label>URL:</Form.Label>
                <Form.Control type="text" placeholder="Enter URL" onChange={(e) => setUrl(e.target.value)} />
              </>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveTemplate}>
            Save Template
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewAllModal} onHide={handleCloseViewAllModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Template List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TemplateTable />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

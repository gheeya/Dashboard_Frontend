import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import apiURL from "../../apiURL";

export default function TemplateTable() {
  const [templateData, setTemplateData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTemplateData, setEditTemplateData] = useState({
    templateName: "",
    category: "",
    templateHeader: "",
    templateBody: "",
    templateFooter: "",
    buttons: []
  });
  const [editTemplateId, setEditTemplateId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiURL + `/api/templates/${window.localStorage.getItem('user_id')}`);
        const extractedData = response.data.data.map((template, index) => ({
          id: template.id,
          serialNo: index + 1,
          templateName: template.name,
          templateType: template.category,
          templateStatus: template.status,
          language: template.language,
          buttons: template.components.filter(component => component.type === "BUTTONS")[0]?.buttons || []
        }));
        setTemplateData(extractedData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "yellow";
      case "REJECTED":
        return "red";
      default:
        return "black";
    }
  };

  const handleEditClick = async (templateId) => {
    try {
      const response = await axios.get(apiURL + `/api/templates/${window.localStorage.getItem('user_id')}/${templateId}`);
      const templateData = response.data.data;
      const headerComponent = templateData.components.find((component) => component.type === "HEADER");
      const bodyComponent = templateData.components.find((component) => component.type === "BODY");
      const footerComponent = templateData.components.find((component) => component.type === "FOOTER");

      setEditTemplateData({
        templateName: templateData.name,
        category: templateData.category,
        templateHeader: headerComponent ? headerComponent.text : "",
        templateBody: bodyComponent ? bodyComponent.text : "",
        templateFooter: footerComponent ? footerComponent.text : "",
        buttons: templateData.components.filter(component => component.type === "BUTTONS")[0]?.buttons || []
      });

      setEditTemplateId(templateId);
      setShowEditModal(true);
    } catch (error) {
      console.log("Error fetching template data for editing:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEditTemplate = async () => {
    try {
      const response = await axios.post(apiURL + `/api/templates/${editTemplateId}/edit`, {
        user_id: window.localStorage.getItem('user_id'),
        tempHeader: editTemplateData.templateHeader,
        tempBody: editTemplateData.templateBody,
        tempFooter: editTemplateData.templateFooter,
        buttons: editTemplateData.buttons.map(button => ({
          text: button.text,
          phone_number: button.phone_number,
          url: button.url
        }))
      });

      setTemplateData((prevData) =>
        prevData.map((template) =>
          template.id === editTemplateId
            ? {
                ...template,
                templateHeader: editTemplateData.templateHeader,
                templateBody: editTemplateData.templateBody,
                templateFooter: editTemplateData.templateFooter,
              }
            : template
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.log("Error updating template:", error);
    }
  };

  const handleDeleteClick = async (templateName) => {
    try {
      const res = await axios.delete(apiURL + "/api/templates" + `/${window.localStorage.getItem('user_id')}`, {
        data: { templateName: templateName },
      });
      const response = await axios.get(apiURL + "/api/templates" + `/${window.localStorage.getItem('user_id')}`);
      const extractedData = response.data.data.map((template, index) => ({
        serialNo: index + 1,
        templateName: template.name,
        templateType: template.category,
        templateStatus: template.status,
        language: template.language,
        buttons: template.components.filter(component => component.type === "BUTTONS")[0]?.buttons || []
      }));
      setTemplateData(extractedData);
    } catch (error) {
      console.log("Error deleting template:", error);
    }
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th className="text-center">Serial No</th>
            <th className="text-center">Template Name</th>
            <th className="text-center">Template Type</th>
            <th className="text-center">Status</th>
            <th className="text-center">Language</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {templateData.map((template) => (
            <tr key={template.serialNo}>
              <td className="text-center">{template.serialNo}</td>
              <td className="text-center">{template.templateName}</td>
              <td className="text-center">{template.templateType}</td>
              <td className="fw-semibold text-center" style={{ color: getStatusColor(template.templateStatus) }}>
                {template.templateStatus}
              </td>
              <td className="text-center">{template.language}</td>
              <td className="text-center">
                <Button className="btn btn-sm me-2 editButton" onClick={() => handleEditClick(template.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button className="btn btn-sm btn-danger " onClick={() => handleDeleteClick(template.templateName)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Name:</Form.Label>
            <Form.Control type="text" placeholder="Enter template name" name="templateName" value={editTemplateData.templateName} onChange={(e) => setEditTemplateData({ ...editTemplateData, templateName: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Select Category:</Form.Label>
            <Form.Select name="category" value={editTemplateData.category} onChange={(e) => setEditTemplateData({ ...editTemplateData, category: e.target.value })}>
              <option value="AUTHENTICATION">AUTHENTICATION</option>
              <option value="MARKETING">MARKETING</option>
              <option value="UTILITY">UTILITY</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Header:</Form.Label>
            <Form.Control type="text" placeholder="Enter template Header" name="templateHeader" value={editTemplateData.templateHeader} onChange={(e) => setEditTemplateData({ ...editTemplateData, templateHeader: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Body:</Form.Label>
            <Form.Control as="textarea" style={{ height: "200px", width: "450px" }} name="templateBody" value={editTemplateData.templateBody} onChange={(e) => setEditTemplateData({ ...editTemplateData, templateBody: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Template Footer:</Form.Label>
            <Form.Control type="text" placeholder="Enter template Footer" name="templateFooter" value={editTemplateData.templateFooter} onChange={(e) => setEditTemplateData({ ...editTemplateData, templateFooter: e.target.value })} />
          </Form.Group>

          {editTemplateData.buttons && Array.isArray(editTemplateData.buttons) && editTemplateData.buttons.map((button, index) => (
            <div key={index}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  {button.type === "PHONE_NUMBER" ? "Button Name(Number)" : "Button Name(Link)"}
                </Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Button Name" 
                  value={button.text} 
                  onChange={(e) => {
                    const updatedButtons = [...editTemplateData.buttons];
                    updatedButtons[index].text = e.target.value;
                    setEditTemplateData({ ...editTemplateData, buttons: updatedButtons });
                  }}
                />
              </Form.Group>
              {button.type === "PHONE_NUMBER" && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Phone Number:</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Phone Number" 
                    value={button.phone_number} 
                    onChange={(e) => {
                      const updatedButtons = [...editTemplateData.buttons];
                      updatedButtons[index].phone_number = e.target.value;
                      setEditTemplateData({ ...editTemplateData, buttons: updatedButtons });
                    }}
                  />
                </Form.Group>
              )}
              {button.type === "URL" && (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">URL:</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="URL" 
                      value={button.url} 
                      onChange={(e) => {
                        const updatedButtons = [...editTemplateData.buttons];
                        updatedButtons[index].url = e.target.value;
                        setEditTemplateData({ ...editTemplateData, buttons: updatedButtons });
                      }}
                    />
                  </Form.Group>
                </div>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveEditTemplate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

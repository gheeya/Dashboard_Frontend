import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import apiURL from "../../apiURL";
import axios from "axios";

export default function Template({
  templateHeader,
  templateBody,
  templateFooter,
  phone,
  selectedTemplate
}) {

  const handleButtonClick = async (e) => {
    try {
      const response = await axios.post(apiURL + `/api/templates/send`, {
        user_id: window.localStorage.getItem("user_id"),
        phoneNumber: phone,
        name: selectedTemplate.name,
        lang: selectedTemplate.language
      });
      if (response.status === 200) {
        console.log("Request successful:", response.data);
      } else {
        console.log("Request failed with status code:", response.status);
      }
    } catch (err) {
      console.log("An error occurred:", err);
      if (axios.isAxiosError(err) && err.response) {
        console.log("Response data:", err.response.data);
        console.log("Status code:", err.response.status);
      } else {
        console.error("Unexpected error:", err.message);
      }
    }
  };

  // Find Contact Us button and Url button
  const contactUsButton = selectedTemplate.components.find(
    (comp) => comp.type === "BUTTONS" && comp.buttons.some(btn => btn.text === "Contact Us")
  );
  const urlButton = selectedTemplate.components.find(
    (comp) => comp.type === "BUTTONS" && comp.buttons.some(btn => btn.type === "URL")
  );

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Template Header</Form.Label>
        <Form.Control
          type="text"
          value={
            templateHeader && templateHeader.text
              ? templateHeader.text
              : ""
          }
          style={{ width: "500px" }}
          readOnly
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Template Body:</Form.Label>
        <Form.Control
          as="textarea"
          value={templateBody && templateBody.text ? templateBody.text : ""}
          style={{ height: "200px", width: "500px" }}
          readOnly
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Template Footer</Form.Label>
        <Form.Control
          type="text"
          value={
            templateFooter && templateFooter.text ? templateFooter.text : ""
          }
          style={{ width: "500px" }}
          readOnly
        />
      </Form.Group>

      {/* Render Contact Us Button fields */}
      {contactUsButton && (
        <>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Contact Us Button Name</Form.Label>
            <Form.Control
              type="text"
              value={contactUsButton.buttons.find(btn => btn.text === "Contact Us").text}
              style={{ width: "500px" }}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Ph.</Form.Label>
            <Form.Control
              type="text"
              value={contactUsButton.buttons.find(btn => btn.text === "Contact Us").phone_number}
              style={{ width: "500px" }}
              readOnly
            />
          </Form.Group>
        </>
      )}

      {/* Render Url Button fields */}
      {urlButton && (
        <>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Button Name</Form.Label>
            <Form.Control
              type="text"
              value={urlButton.buttons.find(btn => btn.type === "URL").text}
              style={{ width: "500px" }}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">URL</Form.Label>
            <Form.Control
              type="text"
              value={urlButton.buttons.find(btn => btn.type === "URL").url}
              style={{ width: "500px" }}
              readOnly
            />
          </Form.Group>
        </>
      )}

      <div className="d-flex justify-content-center">
        <Button className="btn btn-success" type="button" onClick={(e)=>handleButtonClick(e)}>Send Template</Button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Template from "./Template";
import Form from "react-bootstrap/Form";
import apiURL from "../../apiURL";

export default function TemplateDropDown(props) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiURL + "/api/templates" + `/${window.localStorage.getItem('user_id')}`);
        const responseData = response.data;
        const templateData = responseData.data;
        setTemplates(templateData);
      } catch (error) {
        console.log("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleTemplateChange = (templateId) => {
    const selected = templates.find((template) => template.id === templateId);
    if (selected) {
      console.log(selected)
      setSelectedTemplate(selected);
    }
  };

  return (
    <div>
      <h4>Templates</h4>
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Select Template:</Form.Label>
        <Form.Select onChange={(e) => handleTemplateChange(e.target.value)}>
          <option value="">Select A Template</option>
          {Array.isArray(templates) && templates.map((template, index) => (
            <option key={index} value={template.id}>
              {template.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedTemplate && (
        <Template
          templateHeader={selectedTemplate.components.find(
            (comp) => comp.type === "HEADER"
          )}
          templateBody={selectedTemplate.components.find(
            (comp) => comp.type === "BODY"
          )}
          templateFooter={selectedTemplate.components.find(
            (comp) => comp.type === "FOOTER"
          )}
          phone={props.phone}
          selectedTemplateName={selectedTemplate.name}
          selectedTemplate={selectedTemplate}
        />
      )}
    </div>
  );
}

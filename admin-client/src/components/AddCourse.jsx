import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import axios from "axios";
import { BASE_URL } from "../config.js";
import { uploadFile } from 'react-s3';
import { Buffer } from "buffer/";
window.Buffer = Buffer;

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const S3_BUCKET ='coursesellingvideo';
  const REGION = 'ap-south-1';
  const ACCESS_KEY = 'AKIA5A4HQZ74XW23IIF3';
  const SECRET_ACCESS_KEY = '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';

  const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile, config)
        .then(data => {
          console.log(data);
        })
        .catch(err => console.error(err));
    } else {
      console.error("No file selected for upload.");
    }
  };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="add-course-container">
      <div className="add-course-form">
        <TextField
          style={{ marginBottom: 10 }}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth={true}
          label="Title"
          variant="outlined"
        />

        <TextField
          style={{ marginBottom: 10 }}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth={true}
          label="Description"
          variant="outlined"
        />

        <TextField
          style={{ marginBottom: 10 }}
          onChange={(e) => setImage(e.target.value)}
          fullWidth={true}
          label="Image link"
          variant="outlined"
        />

        <TextField
          style={{ marginBottom: 10 }}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth={true}
          label="Price"
          variant="outlined"
        />

        <input type="file" onChange={handleFileInput} />
        <Button
          size={"large"}
          variant="contained"
          onClick={handleUpload} // Call the handleUpload function
        >Upload to S3</Button>
        <Button
          size={"large"}
          variant="contained"
          onClick={async () => {
            await axios.post(`${BASE_URL}/admin/courses`, {
              title: title,
              description: description,
              imageLink: image,
              published: true,
              price,
            }, {
              headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
              }
            });
            alert("Added course!");
          }}
        >Add course</Button>
      </div>
    </div>
  );
}

export default AddCourse;
import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { BASE_URL } from "../config.js";
import { Buffer } from "buffer/";
import { useNavigate } from 'react-router-dom';
window.Buffer = Buffer;

function AddCourse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
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
        <Button
          size={"large"}
          variant="contained"
          onClick={async () => {
            const response=await axios.post(`${BASE_URL}/admin/courses`, {
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
            alert(response.data.message);
            navigate(`/addvideo/${response.data.courseId}`)
          }}
        >Add course</Button>
      </div>
    </div>
  );
}

export default AddCourse;
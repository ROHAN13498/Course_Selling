import React, { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import { Button, Card, Typography } from '@mui/material';
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config.js";
import { uploadFile } from 'react-s3';
import { Buffer } from "buffer/";
import { Videocard } from './Coursecard';
import {useNavigate} from "react-router-dom";

export const Addcv = () => {
    const navigate = useNavigate()

    let { courseId } = useParams();
    const [videos, setVideos] = useState([]);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [video, setVideo] = useState("");

    const init = async () => {
        const response = await axios.get(`${BASE_URL}/admin/url/${courseId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        setVideos(response.data.urls);
    };

    useEffect(() => {
        init();
    }, []);

    const S3_BUCKET = import.meta.env.VITE_BUCKET_NAME
    const REGION =  import.meta.env.VITE_APP_REGION
    const ACCESS_KEY =  import.meta.env.VITE_APP_ACCESS
    const SECRET_ACCESS_KEY =  import.meta.env.VITE_APP_SECRET

    const config = {
        bucketName: S3_BUCKET,
        region: REGION,
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
    };

    const handleUpload = async () => {
        if (selectedImageFile && selectedVideoFile) {
            try {
                const imageData = await uploadFile(selectedImageFile, config);
                const imageUrl = imageData.location;
                console.log(imageUrl);
                setImage(imageUrl);

                const videoData = await uploadFile(selectedVideoFile, config);
                const videoUrl = videoData.location;
                console.log(videoUrl);
                setVideo(videoUrl);

                const videoDataToSend = {
                    title: title,
                    description: description,
                    imageLink: imageUrl,
                    url: videoUrl,
                };
                console.log(videoDataToSend);
                const response = await axios.post(`${BASE_URL}/admin/url/${courseId}`, videoDataToSend, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                console.log(response.data);
                alert(response.data.message);
                navigate("/video/"+response.data.id);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        } else {
            alert("No files selected for upload.");
        }
    };

    const handleImageInput = (e) => {
        setSelectedImageFile(e.target.files[0]);
    };

    const handleVideoInput = (e) => {
        setSelectedVideoFile(e.target.files[0]);
    };

    return (
        <div>
            { (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {videos.map(video => {
                        return <Videocard key={video._id} course={video} />
                    })}
                    <Card style={{
                        margin: 10,
                        width: 300,
                        minHeight: 200,
                        padding: 20,
                        border: '2px dashed #ccc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', 
                        gap: 50, 
                    }}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%' }}
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%' }} 
                        />
                        <input type="file" onChange={handleImageInput} style={{ width: '100%' }} />
                        <input type="file" onChange={handleVideoInput} style={{ width: '100%' }} /> 
                        <Button
                            size={"large"}
                            variant="contained"
                            onClick={handleUpload}
                        >
                            Upload content
                        </Button>
                    </Card>

                </div>

            )}
        </div>
    );
};

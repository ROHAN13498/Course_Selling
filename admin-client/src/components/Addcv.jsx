import React, { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config.js";
import { uploadFile } from 'react-s3';
import { Buffer } from "buffer/";
import { Videocard } from './Coursecard';
export const Addcv = () => {
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

    const S3_BUCKET = 'coursesellingvideo';
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
        if (selectedImageFile && selectedVideoFile) {
            // Uploading image
            uploadFile(selectedImageFile, config)
                .then(async (imageData) => {
                    const imageUrl = imageData.location;
                    setImage(imageUrl);

                    // Uploading video
                    uploadFile(selectedVideoFile, config)
                        .then(async (videoData) => {
                            const videoUrl = videoData.location;
                            setVideo(videoUrl);

                            const response = await axios.post(`${BASE_URL}/admin/url/${courseId}`, {
                                title: title,
                                description: description,
                                imageLink: image,
                                url: video
                            },
                                {
                                    headers: {
                                        "Authorization": "Bearer " + localStorage.getItem("token")
                                    }
                                });
                            alert(response.data.message);
                        })
                        .catch(videoErr => console.error(videoErr));
                })
                .catch(imageErr => console.error(imageErr));
        } else {
            console.error("No files selected for upload.");
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
            {videos.length === 0 ? (
                <div>
                    <p>There are no courses</p>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input type="file" onChange={handleImageInput} />
                    <input type="file" onChange={handleVideoInput} />
                    <Button
                        size={"large"}
                        variant="contained"
                        onClick={handleUpload}
                    >
                        Upload to S3
                    </Button>
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {videos.map(video => {
                        return <Videocard key={video._id} course={video} />
                    })}
                </div>
            )}
        </div>
    );
};

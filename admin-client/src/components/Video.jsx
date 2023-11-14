import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';

export const Video = () => {
  const [video, setVideo] = useState({});
  let { videoId } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/getVideo/${videoId}`);
        setVideo(response.data.video);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [videoId]);

  return (
    <div>
      <h1>{video.title}</h1>
      <p>{video.description}</p>
      <p>{video.imageLink}</p>
      {video.url && (
        <video controls width="500px" height="200px">
          <source src={video.url} type="video/webm" />
        </video>
      )}
    </div>
  );
};

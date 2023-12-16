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
      <video
    id="my-video"
    class="video-js"
    controls
    preload="auto"
    width="640"
    height="264"
    poster="MY_VIDEO_POSTER.jpg"
    data-setup="{}"
  >
    <source src="https://coursesellingvideo.s3.amazonaws.com/test.mp4" type="video/mp4" />
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank"
        >supports HTML5 video</a
      >
    </p>
  </video>

  <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
    </div>
  )
};

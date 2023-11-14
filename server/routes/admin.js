const mongoose = require("mongoose");
const express = require('express');
const { User, Course, Admin,Video } = require("../db");
const jwt = require('jsonwebtoken');
const { SECRET } = require("../middleware/auth")
const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      res.status(403).json({msg: "Admin doesnt exist"})
      return
    }
    res.json({
        username: admin.username
    })
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(admin) {
      if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
      } else {
        const obj = { username: username, password: password };
        const newAdmin = new Admin(obj);
        newAdmin.save();

        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
      }
  
    }
    Admin.findOne({ username }).then(callback);
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.post('/courses', authenticateJwt, async (req, res) => {
    const username=req.user.username;
    const  admin = await Admin.findOne({username});
    const course = new Course(req.body);
    admin.adminCourses.push(course);
    await admin.save();
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
  });
  
  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    
    const username = req.user.username;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(403).json({ message: 'Admin not found' });
    }
  
    await admin.populate('adminCourses')
  
    res.json({ courses: admin.adminCourses });
  });
  
  router.get('/url/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    await course.populate('urls');
    res.json({ urls: course.urls});
  });

  router.post('/url/:courseId',authenticateJwt,async(req,res)=>{
    // console.log("inside route");
    // console.log(req.body);
    const V=new Video(req.body);
    const course = await Course.findById(req.params.courseId);
    course.urls.push(V);
    await V.save();
    await course.save();
    res.json({ message: 'Video added succesfully' });
  })
  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });
  router.get('/getVideo/:videoId',async(req,res)=>{
    const videoId=req.params.videoId;
    const video=await Video.findById(videoId);
    console.log(video);
    res.json({video});
  })

  module.exports = router
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    adminCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
    urls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
});

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageLink: String,
    url: String
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
const Video = mongoose.model('Video', videoSchema); 

module.exports = {
    User,
    Admin,
    Course,
    Video 
};

import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../mongodb/models/post.js';

dotenv.config();
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POSTS
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({success: true, data: posts});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
});

// CREATE A POST
router.route('/').post(async (req, res) => {
  try {
    //console.log("I got here")
    //console.log(req.body);
    console.log('POST request received');
    console.log('Request body:', req.body);

    const {name, prompt, photo} = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    console.log("The photo url is " + photoUrl.url);
    if (!name || !prompt || !photoUrl.url) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }
    
    const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.url,
    });
    console.log("The newpost url is " + newPost);
    
    res.status(200).json({success: true, data: newPost});
    } catch(error) {
        res.status(500).json({success: false, message: error.message});
    }
});

export default router;


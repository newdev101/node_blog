const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/',async (req, res) => {
    const locals = {
        title: 'Home',
        description: 'Welcome to the home page'
    };

    try{
        const data = await Post.find().sort({createdAt: 'desc'});
        res.render('index',{locals,data});
    }catch(error){
        console.log(error.message);
    }



});



router.get('/about', (req, res) => {
    res.render('about');
});


module.exports = router;
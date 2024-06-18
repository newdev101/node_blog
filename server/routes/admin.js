const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const adminLayout = '../views/layouts/admin';


//!         Middleware
const authMiddleware = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'unauthorized'});
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        }catch(error){
            res.status(401).json({message:'unauthorized'});
        }
    }
}

router.get('/admin',async (req, res) => {
    const locals = {
        title: 'Admin',
        description: "it's the admin page"
    };

    try{
        res.render('admin/index',{locals, layout:adminLayout});
    }catch(error){
        console.log(error.message);
    }

});

router.post('/admin',async (req, res) => {
   
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message:'invalid credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'invalid credentials'});
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET);
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard')


    }catch(error){
        console.log(error.message);
    }

});

router.get('/dashboard',authMiddleware,async (req,res)=>{
    res.render('admin/dashboard');
})


router.post('/register',async (req, res) => {
   
    try{
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        try{
          const user = await User.create({username,password:hashedPassword})
          res.status(201).json({message:'user created',user});
        }catch(error){
          if(error.code === 11000){
               res.status(409).json({message:'user already exist'});
          }
          res.status(500).json("enter server error");
        }

        res.redirect('/admin');
    }catch(error){
        console.log(error.message);
    }

});


module.exports = router;

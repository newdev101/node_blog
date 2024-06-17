const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/',async (req, res) => {
   

    try{
        const locals = {
            title: 'Home',
            description: 'Welcome to the home page'
        };

        let perPage = 2;
        let page = parseInt(req.query.page) || 1;
        


        console.log("page: ",page);
        const data = await  Post.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();

        console.log(data);

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hashNextPage = nextPage <= Math.ceil(count/perPage);

       
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hashNextPage ? nextPage : null,
            currentRoute: '/',
        });

        console.log("clicked..");
        
    }catch(error){
        console.log(error.message);
    }

});



router.get('/about', (req, res) => {
    res.render('about');
});



router.get('/post/:id',async (req, res) => {
    

    try{

        
        let slug = req.params.id;
        const data = await Post.findById(slug);
        const locals = {
            title: data.title,
            description: 'Welcome to the home page'
        };
        res.render('post',{locals,data});
    }catch(error){
        console.log(error.message);
    }
});




// router.get('/',async (req, res) => {
//     const locals = {
//         title: 'Home',
//         description: 'Welcome to the home page'
//     };

//     try{
//         const data = await Post.find().sort({createdAt: 'desc'});
//         res.render('index',{locals,data});
//     }catch(error){
//         console.log(error.message);
//     }

// });


module.exports = router;
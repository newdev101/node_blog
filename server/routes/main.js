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



router.post('/search',async (req, res) => {
    
    try{
        const locals = {
            title: 'search',
            description: 'Welcome to the home page'
        };

        let searchTerm = req.body.searchTerm;
        searchTerm = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        console.log(searchTerm);
        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchTerm, 'i')}},
                {body: {$regex: new RegExp(searchTerm, 'i')}}
            ]
        });
        res.render('search',{
            locals,
            data,
        });
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
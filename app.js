const express = require("express");
const path = require("path");
const fs = require('fs')
const multer = require("multer")

const app = express();

app.use(express.static(path.join(__dirname + '/client')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'client/images');  // where the uploaded files will be stored
},
filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // creates unique filenames
}
});

const upload = multer({ storage : storage});


app.post('/api/artpics', upload.single('art'),(req,res)=>{
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { title , artist , description } = req.body;
    if (!title|| !artist || !description) {
        return res.status(400).json({ error: 'All fields must be filled out' });
    }
    

    

    fs.readFile('artgallery.json', (err, data) => {
        if (err) {
          console.log(err)


          

          if (err.code === "ENOENT"){
            artList = [artMeta]

            fs.writeFile('artgallery.json', JSON.stringify(artList, null), (err, data)=>{
                if (err) {
                    console.log(err)
                }
                return res.status(200).json({message: 'Art metadata stored in JSON file'})
            })
          }
          return res.status(404).json({error : 'Cannot find Art Pictures JSON file'})
          
        } else {

          const artList = JSON.parse(data);
          let idCounter = artList.length+1 ;
          const artMeta = {
            artId : idCounter,
            title : req.body.title ,
            artist : req.body.artist,
            description : req.body.description,
            imagePath : '/images/'+req.file.filename,
        }
          
          artList.push(artMeta);
          

          fs.writeFile('artgallery.json', JSON.stringify(artList, null, 2), (err) => {
            if (err) { 
                return res.status(500).json({error : 'Cannot save to JSON'})
            }
            return res.status(200).json({message: 'Art metadata stored in JSON file'})
          });
        }

    

    })
});

app.get('/artgallery', (req, res) => {
    const artgalleryFile = path.join(__dirname , 'artgallery.json');

    

    if (artgalleryFile === undefined ) {
        return res.status(404).json({ error: 'File not found' });
      }
    return res.status(200).sendFile(artgalleryFile);
    
});

app.get('/artgallery/:id', (req, res) => {
  const artId = parseInt(req.params.id); 

  fs.readFile('artgallery.json', (err, data)=>{
    if (err){
        return res.status.json({error:'File not found'})
    }else{
        const artList = JSON.parse(data);
        const artObject = artList.find(art => art.artId === artId);
        

        if (!artObject) {
            return res.status(404).json({ error: 'Art not found' }); 
          }

        return res.status(200).json(artObject)
    }
  })

  
});


//for comments
app.post('/artcomments', upload.none(), (req,res)=>{
    


  const { commentMaker , comment , artofCommentId} = req.body;
  if (!commentMaker|| !comment || !artofCommentId) {
      return res.status(400).json({ error: 'All fields must be filled out' });
  }
  

  fs.readFile('artComments.json', (err, data) => {
      
      
    if (err) {
      console.log(err)
      
    
    } else {
        
        
      const artCommentsList = JSON.parse(data);
      
      let idCounter = artCommentsList.length+1 || 1;
      const artComment = {
        artCommentId : idCounter,
        commentMaker : req.body.commentMaker ,
        comment : req.body.comment,
        artofCommentId : req.body.artofCommentId,
        commentLikes : 0
        }
      
      artCommentsList.push(artComment);
      

      fs.writeFile('artComments.json', JSON.stringify(artCommentsList, null, 2), (err) => {
        if (err) { 
            return res.status(500).json({error : 'Cannot save comment to JSON'})
        }
        return res.status(200).json({message: 'Comment and metadata stored in JSON file'})
      });
    }



  })
})


app.get('/comments/:id', (req,res)=>{
    const artofCommentId = parseInt(req.params.id);
    

    fs.readFile('artComments.json', (err, data)=>{
        if (err){
            return res.status(404).json({error:'File not found'});
        }else{
            const allComments = JSON.parse(data);
            
            const reqComments = [];
            
            
            allComments.forEach(comment => {
                
                if (comment.artofCommentId == artofCommentId){
                    
                    reqComments.push(comment);
                }
            })
            
            
  
          if (!reqComments) {
              return res.status(404).json({ error: 'Comments not found' }); 
            }
  
          return res.status(200).json(reqComments)
        }
      })
})

app.get('/moreComments/:id', (req,res)=>{
  const artCommentId = parseInt(req.params.id);
  

  

  fs.readFile('artComments.json', (err, data)=>{
      if (err){
          console.log(err)
      }else{
          const allComments = JSON.parse(data);

          const clickedComment = allComments.find(comment => comment.artCommentId == artCommentId)
        
         
          
  
          if (!clickedComment) {
              return res.status(404).json({ error: 'Comment not found' }); 
            }
  
          return res.status(200).json(clickedComment)
      }
    })
})

app.patch('/addLikeComment/:id', (req,res)=>{
  const artCommentId = parseInt(req.params.id);
  
  

  fs.readFile('artComments.json', (err, data) => {
    
    
    if (err) {
      console.log(err)
      return res.status(404).json({error: err})
    
    } else {
        
      const commentsList = JSON.parse(data);
      
     

      const likedComment = commentsList.find(comment => comment.artCommentId === artCommentId);
      if (!likedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      likedComment.commentLikes += 1;

      fs.writeFile('artComments.json', JSON.stringify(commentsList, null, 2), (err) => {
        if (err) { 
            return res.status(500).json({error : 'Cannot save comment likes to JSON'})
        }
        return res.status(200).json( likedComment ); 
      });
     
    }
  })
})


app.use((req, res)=>{
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

module.exports = app;
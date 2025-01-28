const express = require("express");
const path = require("path");
const fs = require('fs')
const multer = require("multer")

const app = express();

app.use(express.static(path.join(__dirname + '/client')));
app.use(express.json());


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
                    return res.status(500).json({error : 'Cannot save to JSON'})
                }
                res.json({message: 'Art metadata stored in JSON file'})
            })
          }
          
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
          //console.log(idCounter)
          artList.push(artMeta);
          

          fs.writeFile('artgallery.json', JSON.stringify(artList, null, 2), (err) => {
            if (err) { 
                return res.status(500).json({error : 'Cannot save to JSON'})
            }
            res.json({message: 'Art metadata stored in JSON file'})
          });
        }

    

    })
});

app.get('/artgallery', (req, res) => {
    res.sendFile(path.join(__dirname , 'artgallery.json'));
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

        return res.json(artObject)
    }
  })

  
});

/*
//for comments
app.post('/api/artcomments', (req,res)=>{
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { commentMaker , comment , artofCommentId} = req.body;
    if (!commentMaker|| !comment || !artofCommentId) {
        return res.status(400).json({ error: 'All fields must be filled out' });
    }
    

    fs.readFile('artgallery.json', (err, data) => {
        if (err) {
          console.log(err)

          if (err.code === "ENOENT"){
            artComments = [artMeta]

            fs.writeFile('artgallery.json', JSON.stringify(artList, null), (err, data)=>{
                if (err) {
                    return res.status(500).json({error : 'Cannot save to JSON'})
                }
                res.json({message: 'Art metadata stored in JSON file'})
            })
          }
          
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
          //console.log(idCounter)
          artList.push(artMeta);
          

          fs.writeFile('artgallery.json', JSON.stringify(artList, null, 2), (err) => {
            if (err) { 
                return res.status(500).json({error : 'Cannot save to JSON'})
            }
            res.json({message: 'Art metadata stored in JSON file'})
          });
        }

    

    })
})*/

app.use((req, res)=>{
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
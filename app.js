const express = require("express");
const path = require("path");
const fs = require('fs')
const multer = require("multer")

const app = express();

app.use(express.static(path.join(__dirname + '/client')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

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

    const artMeta = {
        title : req.body.title ,
        artist : req.body.artist,
        description : req.body.description,
        imagePath : req.file.path,
        
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
          console.log(data)
          console.log(artMeta)
          const artList = JSON.parse(data);
          
          artList.push(artMeta);
          console.log(artList)

          fs.writeFile('artgallery.json', JSON.stringify(artList, null, 2), (err) => {
            if (err) {
                return res.status(500).json({error : 'Cannot save to JSON'})
            }
            res.json({message: 'Art metadata stored in JSON file'})
          });
        }

    

    })
});

//app.get()

app.use((req, res)=>{
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
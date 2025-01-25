const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname + '/client')));


app.use((req, res)=>{
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
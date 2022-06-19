const express = require('express');
const app = express();

ROOT_DIR = "./html/";

app.listen(3000);

//Main Page
app.get("/",(req,res) => {
    console.log('It works');
    res.sendFile(ROOT_DIR + 'index.html', { root : __dirname});
});
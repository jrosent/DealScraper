require('dotenv').config();
const express = require('express');

const app = express();
const ROOT_DIR = process.env.ROOT_DIR;
const PORT = process.env.PORT;

app.listen(PORT);

//Main Page
app.get("/",(req,res) => {
    res.sendFile(ROOT_DIR + 'index.html', { root : __dirname});
});
const express = require('express');

const app = express();

app.use(express.json());


app.use((req, res, next)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    
    next();
})

app.get('/', (req, res)=>{
    res.send('Hi from express');
})


module.exports = { app }
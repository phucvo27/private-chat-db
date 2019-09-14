const express = require('express');
const { userRouter } = require('./routes/userRouter')
const { chatRouter } = require('./routes/chatRouter')
require('./models/connection');
//require('./utils/generateData')
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

app.use('/users',userRouter);
app.use('/chat', chatRouter)

module.exports = { app }
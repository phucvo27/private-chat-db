const mongoose  = require('mongoose');

mongoose
    .connect(
        'mongodb://localhost:27017/chatting', 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(()=>{
            console.log('Connect successfully')
        })
        .catch(e => {
            console.log('Connect fail')
        })



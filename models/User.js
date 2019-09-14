const mongoose = require('mongoose');


const userSchemas = new mongoose.Schema({
    username: {
        type: String,
        required: [true , 'Please provide the name of user']
    },
    password: {
        type: String,
        required: [true, 'Please provide the password']
    },
    online: {
        type: String,
        default: null
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const User = mongoose.model('User', userSchemas);

module.exports = { User }
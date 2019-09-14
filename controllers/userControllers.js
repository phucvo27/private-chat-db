const { User } = require('../models/User');


exports.getFriends = async (req, res, next)=>{
    const userId = req.params.id;
    if(userId){
        const user = await User.findById(userId).populate({
            path: 'friends',
            select: 'username online _id'
        })
        if(user){
            res.status(200).send({
                user
            })
        }else{
            res.status(500).send({
                status: 'Fail',
                message: 'User does not exist'
            })
        }
    }else{
        res.status(400).send({
            status: 'Fail',
            message: 'Missing required field'
        })
    }
}
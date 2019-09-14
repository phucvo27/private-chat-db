const { Chat } = require('../models/Chat');

exports.getChat = async (req, res, next)=>{
    req.user = "5d7c9d174cbaa11bbe0a37a5";
    const { chatWith } = req.params;
    let roomName = '';
    if(chatWith){

        if(req.user < chatWith){
            roomName = `${req.user}-${chatWith}`
        }else{
            roomName = `${chatWith}-${req.user}`
        }
        const chat = await Chat.findOne({room: roomName}).populate('messages');
        res.status(200).send({
            chat
        })
    }else{
        res.status(400).send({
            status: 'Fail',
            message: 'Missing required field'
        })
    }
}
const { Message } = require('../models/Message');
const { Chat } = require('../models/Chat');

exports.createMessage = async (data)=>{
    // destruct data box 
    const { from , to , text} = data;
    let roomName = '';
    let chatRoom = null;
    if(from < to){
        roomName = `${from}-${to}`;
    }else{
        roomName = `${to}-${from}`;
    }
    // find chat room
    chatRoom = await Chat.findOne({room: roomName});
    if(!chatRoom){
        chatRoom = await Chat.create({ room: roomName});
    }
    try{
        await Message.create({
            chatID: chatRoom._id,
            text,
            from,
            to,
        })
        return true;
    }catch(e) {
        return false;
    }
    
}
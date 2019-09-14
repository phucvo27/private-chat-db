const socketIO = require('socket.io');
const http = require('http');

const { app } = require('./app');
const { User } = require('./models/User');
const messageController = require('./controllers/messageControllers')
const httpServer = http.createServer(app);
const io = socketIO(httpServer);

const users = [
    {
        id: '1',
        username: 'phucvo',
        listFriend: ['2','3'],
        messages: {
            '2': [
                {from: 'phucvo', body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the phucvo500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
                {from: 'hanh', body:'hahahah , what are you talking about'}
            ],
            '3': [
                {from: 'phucvo', body: 'Hello , i love you so much minimo'},
                {from: 'minimo', body:'Wow, i love you daddy'}
            ]
        }
    },
    {
        id: '2',
        username: 'hanh',
        listFriend: ['1','3'],
        messages: {
            '1': [
                {from: 'phucvo', body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the phucvo500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
                {from: 'hanh', body:'hahahah , what are you talking about'}
            ],
            '3': [
                {from: 'hanh', body: 'Hello , i love you so much minimo'},
                {from: 'minimo', body:'Wow, i love you mommy'}
            ]
        }
    },
    {
        id: '3',
        username: 'minimo',
        listFriend: ['1','2']
    },
    {
        id: '4',
        username: 'bushjdo',
        listFriend: ['3']
    },
]

io.use(async (socket, next)=>{
    //const userIndex = users.findIndex(user => user.username === socket.handshake.query.username);
    const { username, password } = socket.handshake.query;
    const user = await User.findOne({username , password})
    if(user){
        user.online = socket.id;
        //users[userIndex].socketID = socket.id;
        await user.save();
        socket.userId = user._id.toString();
        socket.currentUser = user.toObject();
        return next();
    }
    return next(new Error('Could not found user'))
});

io.on('connection', (socket)=>{
    console.log('new connect from server');
    socket.broadcast.emit('newFriendOnline', {newUserid: socket.userId, socketID: socket.id});
    socket.emit('currentUser', {user: socket.currentUser})
    // socket.on('getListFriend', (data)=>{
    //     const userIndex = users.findIndex(user => user.username === data.username);
    //     //console.log(users[userIndex])
    //     const listFriends = [];
    //     if(userIndex > -1){
    //         for(let i = 0; i < users[userIndex].listFriend.length; i++){
    //             listFriends.push(users.filter(user => user.id === users[userIndex].listFriend[i])[0]);
    //         }
    //         //console.log(listFriends);
    //         socket.emit('resList', listFriends)
    //     }else{
    //         socket.emit('resList', []);
    //     }
    // })

    socket.on('sendNewMessage', async (data)=>{
        const { fromUser, body, toUserId, fromUserId, socketID } = data;
        console.log(data);
        // save message into database
        const messageInfor = { from: fromUserId, to: toUserId, text: body}
        const isSaved = await messageController.createMessage(messageInfor);
        if(isSaved){
            const message = {from: fromUser, body, fromUserId};
            io.to(socketID).emit('newMessage', message);
        }else{

        }


        
        // // get user 
        // const currentUserIndex = users.findIndex(user =>  user.id === fromUserId);
        // if(currentUserIndex > -1){
        //     users[currentUserIndex].messages[toUserId].push({from: fromUser, body})
        // }
        // // update message at user who received message
        // const userReceiveIndex = users.findIndex(user =>  user.id === toUserId);
        // if(userReceiveIndex > -1){
        //     console.log(users[userReceiveIndex].messages[fromUserId])
        //     users[userReceiveIndex].messages[fromUserId].push({from: fromUser, body})
        // }
        

    })
})


httpServer.listen(5000, ()=>{
    console.log('Server is listening at 5000...')
})
import React from 'react';
import axios from 'axios'
import getSocketConnection from '../../utils/socketConnection';
import './main.style.scss';

class Main extends React.Component{
    constructor(){
        super();
        this.state = {
            listFriend: [],
            username: '',
            currentUserChating: '',
            currentUserChattingSocket: '',
            currentUserChattingName: '',
            messages: [],
            user: null
        }
    }

    componentDidMount(){
        const username = prompt('Username : ');
        const password = prompt('Password : ')
        //const username = 'phucvo'
        try{
            const socket = getSocketConnection(username, password);
            socket.on('connect', ()=>{
                if(socket.connected){
                    //console.log('connect success');
                    console.log(socket.id)
                    
                }else{
                    console.log('something went wrong')
                }
            });
            socket.on('currentUser', async (data)=>{
                const { user } = data;
                //console.log(user)
                const response = await axios.get(`http://localhost:5000/users/${user._id}/list-friend`);
                //console.log(response.data)
                const { friends } = response.data.user
                this.setState(()=>{
                    return {
                        username: user.username,
                        user,
                        listFriend: friends,
                        currentUserChating: friends[0]._id
                    }
                });

                
            })
            socket.on('newFriendOnline', ({newUserid, socketID})=>{
                //console.log(newUserid, socketID)
                const isFriend = this.state.listFriend.findIndex(({_id}) => _id === newUserid);
                if(isFriend > -1){
                    //console.log('prepare to update friend status')
                    this.setState(prevState => {
                        prevState.listFriend[isFriend] = {...prevState.listFriend[isFriend], online: socketID};
                        console.log(prevState);
                        return {
                            listFriend: prevState.listFriend
                        }
                    })
                }
            })
            socket.on('newMessage', (message)=>{
                console.log(`Got message from : ${message.from}`);
                this.setState(prevState => {
                    prevState.messages.push(message);
                    return{
                        messages: prevState.messages
                    }
                })

            })
        }catch(e){
            //console.log('Can not connect to socket server');
        }
        
    }
    handleChooseUserForChatting = async (_id, socketID, username)=>{
        const res = await axios.get(`http://localhost:5000/chat/${_id}`);
        //console.log(res.data)
        if(res.data.chat){
            const { messages } = res.data.chat
            this.setState(()=>(
                {
                    currentUserChattingSocket: socketID, 
                    currentUserChating: _id,
                    currentUserChattingName: username,
                    messages
                }
                ))
        }
    }
    renderListFriends = ()=>{
        const { listFriend }= this.state;
        if(listFriend.length > 0){
            return listFriend.map(({_id, username, online, socketID}, index)=> (
                <div 
                    className={`friend ${index === 0 ? 'active':'' }`} 
                    key={index}
                    onClick={()=>{
                        this.handleChooseUserForChatting(_id, online, username)
                    }}>
                    <div className='friend--avatar'>
                        <img src="https://png.pngtree.com/svg/20170308/508749a69e.svg" alt="friend avatar" />
                    </div>
                    <div className='friend--name'>
                        <p>{online}</p>
                    </div>
                    <div className={`${online ? 'friend--online' : 'friend--offline'}`}></div>
                </div>
            ))
        }else{
            return <p>No Friend</p>
        }
    }

    renderMessages = ()=>{
        const { messages, user , currentUserChattingName} = this.state;
        //console.log(currentUserChattingName)
        if(messages){
            return messages.map((message, index) => {
                return (
                    <li className='message' key={index}>
                        <div className={`message__details ${message.from === user._id && 'owner'}`}>
                            <div className='message__details--avatar'>
                                <img src="https://png.pngtree.com/svg/20170308/508749a69e.svg" alt="message__details avatar" />
                            </div>
                            <div className='message__details--text'>
                                <h4>{message.from === user._id ? user.username : currentUserChattingName}</h4>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    </li>
                )
            })
        }else{
            return <p>No Message</p>
        }
        
    }

    handleSendMessage = (e)=>{
        e.preventDefault();
        const socket = getSocketConnection();
        const text = e.target.elements.message.value;
        const {currentUserChattingSocket, user,currentUserChating} = this.state;
        socket.emit('sendNewMessage',{
            fromUser: user.username, 
            text, 
            toUserId: currentUserChating, 
            fromUserId: user._id, 
            socketID: currentUserChattingSocket})
        
        e.target.elements.message.value = ''
        this.setState((prevState)=>{
            prevState.messages.push({from: user._id, text})
            return {
                messages: prevState.messages
            }
        })
    }
    render(){
        //console.log(this.state)
        return (
            <div className="container">
                <div className="list-friends">
                    {
                        this.renderListFriends()
                    }
                </div>
                <div className="message__box">
                    <h2>Messages</h2>
                    <ul className='messages'>
                        {this.renderMessages()}
                    </ul>
                    <form onSubmit={this.handleSendMessage}>
                        <input type='text' placeholder='Type your message' name='message'/>
                        <button type='submit'>Send Message</button>
                    </form>
                </div>
                
            </div>
        )
    }
}

export default Main;
import React from 'react';
import getSocketConnection from '../../utils/socketConnection';
import './main.style.scss';

class Main extends React.Component{
    constructor(){
        super();
        this.state = {
            listFriend: [],
            username: '',
            currentUserChating: '',
            currentMessage: '',
            messages: null
        }
    }

    componentDidMount(){
        const username = prompt('Username : ');
        //const username = 'phucvo'
        try{
            const socket = getSocketConnection(username);
            socket.on('connect', ()=>{
                if(socket.connected){
                    console.log('connect success');
                    console.log(socket.id)
                    socket.emit('getListFriend', {username})
                }else{
                    console.log('something went wrong')
                }
            });
            socket.on('currentUser', (data)=>{
                const { user } = data;
                this.setState(()=>{
                    return {
                        id: user.id,
                        username: user.username,
                        messages: user.messages,
                        currentMessage: Object.keys(user.messages)[0]
                    }
                })
                
            })
            socket.on('resList', (listFriend)=>{
                if(listFriend.length > 0){
                    this.setState(()=>({listFriend}))
                }else{
                    console.log('No Friends')
                }
            })

            socket.on('newFriendOnline', ({newUserid, socketID})=>{
                console.log(newUserid, socketID)
                const isFriend = this.state.listFriend.findIndex(({id}) => id === newUserid);
                if(isFriend > -1){
                    console.log('prepare to update friend status')
                    this.setState(prevState => {
                        prevState.listFriend[isFriend] = {...prevState.listFriend[isFriend], online: true, socketID};
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
                    prevState.messages[message.fromUserId].push({from: message.from, body: message.body});
                    return{
                        messages: prevState.messages
                    }
                })

            })
        }catch(e){
            console.log('Can not connect to socket server');
        }
        
    }
    renderListFriends = ()=>{
        const { listFriend }= this.state;
        if(listFriend.length > 0){
            return listFriend.map(({id, username, online, socketID}, index)=> (
                <div className={`friend ${index === 0 ? 'active':'' }`} key={index} onClick={()=>{
                    this.setState(()=>({currentUserChating: socketID, currentMessage: id}))
                }}>
                    <div className='friend--avatar'>
                        <img src="https://png.pngtree.com/svg/20170308/508749a69e.svg" alt="friend avatar" />
                    </div>
                    <div className='friend--name'>
                        <p>{username}</p>
                    </div>
                    <div className={`${online ? 'friend--online' : 'friend--offline'}`}></div>
                </div>
            ))
        }else{
            return <p>No Friend</p>
        }
    }

    renderMessages = ()=>{
        const { currentMessage, messages, username } = this.state;
        if(messages){
            return messages[currentMessage].map((message, index) => {
                return (
                    <li className='message' key={index}>
                        <div className={`message__details ${message.from === username && 'owner'}`}>
                            <div className='message__details--avatar'>
                                <img src="https://png.pngtree.com/svg/20170308/508749a69e.svg" alt="message__details avatar" />
                            </div>
                            <div className='message__details--text'>
                                <h4>{message.from}</h4>
                                <p>{message.body}</p>
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
        const body = e.target.elements.message.value;
        const { username, currentMessage, id,currentUserChating} = this.state;
        socket.emit('sendNewMessage',{fromUser: username, body, toUserId: currentMessage, fromUserId: id, socketID: currentUserChating})
        this.setState((prevState)=>{
            prevState.messages[currentMessage].push({from: username, body})
            return {
                messages: prevState.messages
            }
        })
    }
    render(){
        console.log(this.state)
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
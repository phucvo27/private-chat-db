import io from 'socket.io-client';

function memoizeSocket(){
    let socket = null;

    return function(username){
        if(socket){
            console.log('get old socket')
            return socket;
        }else{
            socket = io.connect('http://localhost:5000', {
                query:{
                    username
                }
            });
            return socket
        }

    }
}

const getConnection = memoizeSocket();

export default getConnection;
const { User } = require('../models/User');

async function createUser(){
    const user1 = await User.create({
        username: 'Phuc',
        password: '12345678',

    })
    const user2 = await User.create({
        username: 'Joker',
        password: '12345678',
        
    })
    const user3 = await User.create({
        username: 'Bushjdo',
        password: '12345678',
        
    })

    user1.friends = user1.friends.concat([user2._id, user3._id]);
    user2.friends = user2.friends.concat([user1._id]);
    user3.friends = user3.friends.concat([user1._id]);
    try{
        await Promise.all([user1.save(), user2.save(), user3.save()])
    }catch(e){
        console.log('Could not save friend');
        return 'Create fail';
    }

    return 'Create Data Success';
}

createUser().then((res)=>{
    console.log(res)
}).catch(e =>{
    console.log(e)
})
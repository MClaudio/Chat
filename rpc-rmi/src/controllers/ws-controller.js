const users = [];
const send = (ws, data) => {
    const d = JSON.stringify({
        jsonrpc: '2.0',
        ...data
    });
    ws.send(d);
}
const idUsernameToken = (username) => {
    let taken = false;
    for (let i = 0; i< users.length; i++) {
      if(users[i].username === username){
          taken = true;
          break;
      }
       
    }
    return taken;
}
module.exports = (ws, req) =>{
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        switch (data.method){

            case 'username':
                //store user with select username
                if(idUsernameToken(data.params.username)){
                    send(ws, {id: data.id, error: {message: 'username is token'}})
                }else{
                    users.push({
                        username: data.params.username,
                        ws: ws,                    
                    });
                    send(ws, {id: data.id, result: {status: 'success'}})
                }
                break;
            
            case 'message':
                //send message to all conected users
                const username = users.find(user => user.ws == ws).username;
                users.forEach(user => {
                    send(user.ws, {method: 'update', params: {message: data.params.message, username: username}})
                });
                break;

        }
    })
}
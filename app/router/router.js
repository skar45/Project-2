/* CONTROLLER FOLDER ========================================
The controller is the logical related to interaction and
'controlling' behaviour. In our serer-side code, the only
real controller elements are the 'router', so we create a
router folder
====================================================== */

const db = require('../config/connection');
const orm = require('../models/orm');
const socket = require('./socket')
let username = '/';
let room = 'default';



function router(app) {
    app.get('/saved',async (req, res) => {
        const result = await orm.getMsg()
        //console.log(result)
        res.send(result)
    });

    app.get('/api/data', async (req, res) => {
        const result = await orm.getData()
        //console.log(result)
        res.send(result)
        // res.sendFile(__dirname + '/index.html')
    });

    //needs some changes
    app.get('/api/rooms', async(req,res)=>{
        const result = await orm.showRooms()
        console.log(JSON.stringify(result))
        res.send(JSON.stringify(result))
    });

    app.post('/api/send', async(req,res)=> {
        console.log('post recieved: ', req.body.message)
        //const result = await orm.insertMsg(username,req.body.message,room)
        //console.log(result)
        console.log(room)
        let result = await orm.getRoomId(room)
        result = JSON.parse(JSON.stringify(result))[0].id
        result = await orm.insertMsg(result,username,req.body.message)
        res.send(result)
    });

    app.post('/login', async (req,res)=>{
        username = req.body.login;
        const password = req.body.pass;
        const result = await orm.passwordMatch(username,password);
        console.log(result.length===0?false:true)
        res.send(result.length!==0);
    });

    app.post('/api/create', async(req,res)=>{
        const result = await orm.createRoom(req.body.Room)
        res.send(result)
    })

    app.post('/api/choose', async(req,res)=>{
        room = req.body.room
        console.log('room chosen: ', room)
        res.send({message:'room choosen'});
        socket.socket();
    })

    app.post('/signup', async (req,res)=>{
        const regex = /^((?=\S*?[a-z])(?=\S*?[0-9]).{8,})\S$/gm
        const user = req.body.login;
        const password = req.body.pass;
        console.log('login info: ', user, password)
        const result = regex.test(password)? await orm.signUp(user,password): false;
        console.log(regex.test(user))
        res.send(result)

    })

}

module.exports = {router, returnName, returnRoom }

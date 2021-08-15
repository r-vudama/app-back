import express from 'express';
import path from 'path';
import * as http from 'http';
import io from 'socket.io';
import routerProducts from './routes/routerProductos';
import fs from 'fs/promises';

const pathTxt = './products.txt';
const pathTxt2 = './comments.txt';

//EXPRESS
const app = express();
const port = 8080;

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

//PUG
app.set('view engine', 'pug');
const viewsPath = path.resolve(__dirname, '../views');
app.set('views', viewsPath);

const myServer = http.Server(app);

myServer.listen(port, () => console.log('Server UP en puerto', port));

app.get('/', (req, res) => {
    res.render('index');
  });

const myWSServer = io(myServer);

const messages = [];
const comments = [];

myWSServer.on('connection', socket => {

    console.log('Un cliente se ha conectado');

        socket.on('new-message', data => {

        const newMessage = {
            socketId: socket.client.id,
            message: data,
        };
        console.log(newMessage)

        messages.push(newMessage);
        fs.writeFile(pathTxt, JSON.stringify(messages, null, 2));

        myWSServer.emit('messages', messages)
    });

    socket.on('askData', data => {
        console.log('ME LLEGO DATA');
        socket.emit('messages', messages)
    }); 


    socket.on('new-comment', data => {

        const newComment = {
            socketId: socket.client.id,
            comment: data,
        };
        console.log(newComment)

        comments.push(newComment);
        fs.writeFile(pathTxt2, JSON.stringify(comments, null, 2));
        
        myWSServer.emit('comments', comments)
    });

    socket.on('askComment', data => {
        console.log('ME LLEGO DATA');
        socket.emit('comments', comments)
    });
}) 

//ROUTER
app.use('/api/productos', routerProducts);

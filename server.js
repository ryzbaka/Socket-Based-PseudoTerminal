const io = require('socket.io')();
const pty = require('node-pty');
const PORT = 5000;

let ptyProcess;

io.on('connection',socket=>{
    console.log('Socket server connected to socket client.');
    console.log('Initializing ptyProcess...')
    ptyProcess = pty.spawn('bash',[],{
        name:'xterm-color',
        cols:80,
        rows:30,
        cwd:process.env.HOME,
        env:process.env
    });
    ptyProcess.on('data',data=>{
        socket.emit('send-output',data)
    });
    socket.on('run-command',command=>{
       console.log(`Server received command ${command}`);
       ptyProcess.write(`${command}\r`);
    })
})
io.on('disconnect',()=>{
    console.log("Socket server got disconnected from client socket.")
})

io.listen(PORT);
console.log(`Socket server listening on : ${PORT}`)
const terminal = new Terminal();
terminal.open(document.getElementById('terminal'));
terminal.write('Hello from \x1B[1;3;31mWeb Terminal\x1B[0m \n\r');
let promptext;
let command="";
let promptLength=0;
terminal.onData(e=>{
    if(e==='\u007F'){
        if(terminal._core.buffer.x>2){
            terminal.write('\b \b');
            console.log(command.substr(0,command.length-1))
        }
    }
})
terminal.onKey(({key,domEvent})=>{
    if(domEvent.code==="Enter"){
        console.log("Enter key was pressed");
        console.log(`Command is ${command}`);
        socket.emit('run-command',command)
        command="";
        console.log(`Command reset to ${command}`)
    }else{
        command+=key;
        terminal.write(key)
    }
})
const socket = io.connect("http://localhost:5000");
socket.on('connect',()=>{
    terminal.write('\x1B[1;1;32m***Connected to Socket Server ✔ ***\x1B[0m \n\r'); 
    socket.on('send-output',output=>{
        promptLength=output.length;
        promptext=output;
        console.log(promptext)
        console.log(promptLength) 
        terminal.write("\n\r")
        terminal.write(output)
    })
})
socket.on('disconnect',()=>{
    terminal.write('\x1B[1;3;31m***Disconnected from Socket Server ☠ ***\x1B[0m \n\r');
})

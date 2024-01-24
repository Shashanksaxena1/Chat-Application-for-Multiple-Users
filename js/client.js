const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('facebookchat.mp3');
var sound = new Audio('leave-meeting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    if(message == ''){
        alert("Cannot Send Empty Text!!!");
    }
    else{
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
})

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', name =>{
    name=name.charAt(0).toUpperCase() + name.slice(1);
    append(`${name} joined the chat`, 'right');

})

socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})

socket.on('left', name =>{
    sound.play();
    append(`${name} left the chat`, 'right');
})
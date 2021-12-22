const charForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users')
//getting username and room form from the url
const {username , room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
console.log(username, room);
const socket = io();


// Join chatrooom
socket.emit('join',{username,room})

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users)
})

socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop=chatMessages.scrollHeight;
});

charForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg= e.target.elements.msg.value;
    //Giving the message to the server
    socket.emit('chatMessage',msg);

    //Clearing input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})

//outputMessage to DOM
function outputMessage(msg){
    const div= document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
    ${msg.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room;

}
function outputUsers(users){
    roomUsers.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}
'use strict';

const socket = io({
    extraHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('userAccessToken')}`
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let userId;
    let userName;
    let userImage;
    let adminId ;
    let isAdminReplyDisplayed = false; 
    let typingTimeout;
    

    socket.on('userInfo', (data) => {
        userId = data.userId;
        userName = data.userName;
        userImage = data.userImage; 
        adminId = data.adminId;
    });


    socket.on('receiveMessage', ({ sender, message, senderId, senderImage,image }) => {
        // Only add message to UI if it's not from the current sender
        if (senderId !== userId) {
            const senderName = senderId === userId ? 'You' : sender;
            const isOwnMessage = senderId === userId;
            const timeOptions = { hour: 'numeric', minute: 'numeric' };
            const time = new Date().toLocaleTimeString(undefined, timeOptions);
            addMessageToChat(senderName, message, time, isOwnMessage, senderImage, image);
        }
    });

    const userMessageInput = document.getElementById('user-message');
    userMessageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.ctrlKey) { // Check for Enter key and not Ctrl+Enter
            event.preventDefault();
            window.sendUserMessage();
        } else {
            socket.emit('typing', { isTyping: true, recipientId: adminId });
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit('typing', { isTyping: false, recipientId: adminId });
            }, 2000);
        }
    });

    socket.on('typing', ({ isTyping, senderId }) => {
        if (senderId !== userId) {
            const typingIndicator = document.querySelector('.typing-indicator em');
            typingIndicator.textContent = isTyping ? 'Admin is typing...' : '';
        }
    });

    window.sendUserMessage = function() {
        const message = document.getElementById('user-message').value;
        const file = userImageInput.files[0];
        if (message.trim() !== '' || file) {
            const timeOptions = { hour: 'numeric', minute: 'numeric' };
            const time = new Date().toLocaleTimeString(undefined, timeOptions);
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;
                    socket.emit('privateMessage', { message, senderId: userId, recipientId: adminId, senderImage: userImage, image: imageData }, (ack) => {
                        if (ack.status === 'ok') {
                            addMessageToChat('You', message, time, true, userImage, imageData);
                        } else {
                            console.error('Message failed to send:', ack.error);
                        }
                    });
                    userImageInput.value = '';
                    userImagePreview.innerHTML = '';
                };
                reader.readAsDataURL(file);
        } else {

            socket.emit('privateMessage', { message, senderId: userId, recipientId: adminId, senderImage: userImage }, (ack) => {
                if (ack.status === 'ok') {
                    addMessageToChat('You', message, time, true, userImage); // Display message in user's chat window
                    if (!isAdminReplyDisplayed) {
                        displayAdminReplyMessage(); 
                        isAdminReplyDisplayed = true; 
                    }
                } else {
                    console.error('Message failed to send:', ack.error);
                }
            });
        }
            document.getElementById('user-message').value = '';

        }
    };

    function displayAdminReplyMessage() {
        const messageElement = document.createElement('div');
        messageElement.classList.add('admin-reply-message');
        messageElement.textContent = "Kindly be patient. Admin will join the chat soon.";
        document.getElementById('user-chat-messages').appendChild(messageElement);
    }

    function addMessageToChat(sender, message, time, isOwnMessage, senderImage, image = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(isOwnMessage ? 'chat-message-left' : 'chat-message-right');
        messageElement.innerHTML = `
            <div>
                <img src="${senderImage || 'https://bootdey.com/img/Content/avatar/avatar5.png'}" class="rounded-circle mr-1" alt="${sender}" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">${time}</div>
            </div>
            <div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3" style="background-color: #f8f9fa !important;">
                <div class="font-weight-bold mb-1" style="color:#1c1c39 !important;">${sender}</div>
                ${message}
                ${image ? `<img src="${image}" class="img-thumbnail mt-2" width="100">` : ''}
            </div>
        `;
        document.getElementById('user-chat-messages').appendChild(messageElement);
    }
});

const userImageInput = document.getElementById('user-image-upload');
const userImagePreview = document.getElementById('user-image-preview');

userImageInput.addEventListener('change', () => {
    const file = userImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userImagePreview.innerHTML = `<img src="${e.target.result}" class="img-thumbnail" width="100">`;
        };
        reader.readAsDataURL(file);
    }
});


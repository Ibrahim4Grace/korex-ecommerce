'use strict';

const socket = io({
    extraHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('adminAccessToken')}`
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let adminId;
    let adminName;
    let adminImage;
    let currentUser;
    let typingTimeout;

    socket.on('adminInfo', (data) => {
        adminId = data.adminId;
        adminName = data.adminName;
        adminImage = data.adminImage;
    });

    // Display all users in the user list
    socket.on('allUsers', (users) => {
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.classList.add('list-group-item', 'list-group-item-action');
            userItem.setAttribute('data-user-id', user.userId);
            userItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${user.userImage}" class="rounded-circle mr-1" alt="${user.userName}" width="40" height="40">
                    <div class="flex-grow-1 font-weight-bold mb-1">
                        ${user.userName}
                        <div class="text-muted small" id="preview-${user.userId}"></div>
                    </div>
                    <div class="badge bg-primary" id="count-${user.userId}"></div>
                </div>
            `;
            userItem.addEventListener('click', () => loadUserChat(user.userId));
            userList.appendChild(userItem);
        });
    });

    socket.on('receiveMessage', ({ sender, message, senderId, senderImage, unreadCount, image }) => {

        // Move the user to the top of the user list
        const userItem = document.querySelector(`[data-user-id="${senderId}"]`);
        const userList = document.getElementById('user-list');
        if (userItem) {
            userList.prepend(userItem);
        }

        // Update preview message
        const preview = document.getElementById(`preview-${senderId}`);
        if (preview) {
            preview.textContent = message.slice(0, 10) + '...';
        }
        // Update unread count badge
        const countBadge = document.getElementById(`count-${senderId}`);
        if (countBadge) {
            if (senderId !== currentUser) {
                countBadge.textContent = unreadCount > 0 ? unreadCount : '';
                countBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
            } else {
                countBadge.textContent = '';
                countBadge.style.display = 'none';
            }
        }

        if (senderId === currentUser) {
            const isOwnMessage = senderId === adminId;
            const timeOptions = { hour: 'numeric', minute: 'numeric' };
            const time = new Date().toLocaleTimeString(undefined, timeOptions);
            addMessageToChat(sender, message, time, isOwnMessage, senderImage, image);
        }
    });

    const adminMessageInput = document.getElementById('admin-message');
    adminMessageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.ctrlKey) { // Check for Enter key and not Ctrl+Enter
            event.preventDefault();
            window.sendAdminMessage();
        } else {
            socket.emit('typing', { isTyping: true, recipientId: currentUser });
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit('typing', { isTyping: false, recipientId: currentUser });
            }, 2000);
        }
    });

    socket.on('typing', ({ isTyping, senderId }) => {
        if (senderId !== adminId) {
            const typingIndicator = document.querySelector('.typing-indicator em');
            typingIndicator.textContent = isTyping ? 'User is typing...' : '';
        }
    });

    window.sendAdminMessage = function() {
        const message = adminMessageInput.value;
        const file = adminImageInput.files[0];
        if (message.trim() !== '' || file) {
            const timeOptions = { hour: 'numeric', minute: 'numeric' };
            const time = new Date().toLocaleTimeString(undefined, timeOptions);

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;
                    socket.emit('privateMessage', { message, senderId: adminId, recipientId: currentUser, senderImage: adminImage, image: imageData }, (ack) => {
                        if (ack.status === 'ok') {
                            addMessageToChat('Admin', message, time, true, adminImage, imageData);
                        } else {
                            console.error('Message failed to send:', ack.error);
                        }
                    });
                    adminImageInput.value = '';
                    adminImagePreview.innerHTML = '';
                };
                reader.readAsDataURL(file);
            } else {
                socket.emit('privateMessage', { message, senderId: adminId, recipientId: currentUser, senderImage: adminImage, image: null }, (ack) => {
                    if (ack.status === 'ok') {
                        addMessageToChat('Admin', message, time, true, adminImage, null);
                    } else {
                        console.error('Message failed to send:', ack.error);
                    }
                });
            }

            adminMessageInput.value = '';
        }
    };

    function addMessageToChat(sender, message, time, isOwnMessage, senderImage, image = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(isOwnMessage ? 'chat-message-right' : 'chat-message-left');
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
        document.getElementById('admin-chat-messages').appendChild(messageElement);
    }

    function loadUserChat(userId) {
        currentUser = userId;
        document.getElementById('admin-chat-messages').innerHTML = ''; // Clear the chat area
        socket.emit('loadChatHistory', userId, (history) => {
            history.forEach(({ sender, message, time, senderImage, image }) => {
                const isOwnMessage = sender === adminName;
                addMessageToChat(sender, message, time, isOwnMessage, senderImage, image);
            });
            const countBadge = document.getElementById(`count-${userId}`);
            if (countBadge) {
                countBadge.textContent = '';
                countBadge.style.display = 'none';
            }
        });
    }
});

const adminImageInput = document.getElementById('admin-image-upload');
const adminImagePreview = document.getElementById('admin-image-preview');

adminImageInput.addEventListener('change', () => {
    const file = adminImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            adminImagePreview.innerHTML = `<img src="${e.target.result}" class="img-thumbnail" width="100">`;
        };
        reader.readAsDataURL(file);
    }
});





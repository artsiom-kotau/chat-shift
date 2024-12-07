const messagesContainer = document.getElementById('messages');
let socket = createWebSocket();

function createWebSocket() {
    const ws = new WebSocket('ws://localhost:8080/ws'); // Обновите URL вашего WebSocket сервера

    ws.addEventListener('open', () => {
        console.log('Connected to WebSocket server');
    });

    ws.addEventListener('message', (event) => {
        const { name, text, date } = JSON.parse(event.data);
        const messageElement = document.createElement('div');
        messageElement.className = 'message ' + (name === userName ? 'own' : 'other');
        messageElement.textContent = `${name}: ${text} (${new Date(date).toLocaleString()})`;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    ws.addEventListener('close', () => {
        console.error('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(() => {
            socket = createWebSocket();
        }, 5000); // Попытка переподключения через 5 секунд
    });

    ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });

    return ws;
}

// Check for userName in cookies
let userName = getCookie('userName');
if (userName) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    document.getElementById('userNameDisplay').textContent = userName;
    loadMessages();
}

function login() {
    const input = document.getElementById('userNameInput');
    const name = input.value.trim();

    if (name) {
        userName = name;
        setCookie('userName', name, 10); // Store username in cookies for 10 minutes
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        document.getElementById('userNameDisplay').textContent = userName;
        loadMessages();
    }
}

function logout() {
    deleteCookie('userName');
    location.reload();
}

// Fetch last 20 messages when the app starts
function loadMessages() {
    fetch('http://localhost:8080/messages?offset=0&amount=20') // Update with your REST API endpoint
        .then(response => response.json())
        .then(messages => {
            messagesContainer.innerHTML = '';
            messages.forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.className = 'message ' + (msg.name === userName ? 'own' : 'other');
                messageElement.textContent = `${msg.name}: ${msg.text} (${new Date(msg.date).toLocaleString()})`;
                messagesContainer.appendChild(messageElement);
            });
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(error => console.error('Error fetching messages:', error));
}


function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();

    if (messageText) {
        const message = { name: userName, text: messageText, date: new Date().toISOString() };
        socket.send(JSON.stringify(message))
        input.value = '';
    }
}

document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function setCookie(name, value, minutes) {
    const expires = new Date(Date.now() + minutes * 60000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

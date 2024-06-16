// Funzione per generare un GUID (UUID)
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Funzione per ottenere o generare e salvare un GUID nel localStorage
function getOrGenerateGUID() {
    let sender = localStorage.getItem('sender');
    if (!sender) {
        sender = generateGUID();
        localStorage.setItem('sender', sender);
    }
    return sender;
}

// Funzione per eliminare il GUID dal localStorage
function clearGUID() {
    localStorage.removeItem('sender');
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const message = chatInput.value;

    if (message.trim() !== '') {
        // Append user message
        const userMessage = document.createElement('div');
        userMessage.classList.add('chat-message', 'user');
        userMessage.innerHTML = `<div class="message">${message}</div>`;
        chatBody.appendChild(userMessage);

        // Scroll to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;

        // Clear the input
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show loading animation
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('chat-message', 'bot');
        loadingMessage.innerHTML = `
            <div class="message loading">
                <span></span><span></span><span></span>
            </div>`;
        
        chatBody.appendChild(loadingMessage);
        chatBody.scrollTop = chatBody.scrollHeight;

        const sender = getOrGenerateGUID(); // Ottieni o genera e salva un GUID
        console.log(sender)

        // Make API call to Rasa
        fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: sender,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading animation
            chatBody.removeChild(loadingMessage);

            data.forEach(botResponse => {
                // Append bot message with API response
                const botMessage = document.createElement('div');
                botMessage.classList.add('chat-message', 'bot');
                botMessage.innerHTML = `<div class="message">${formatMessage(botResponse.text)}</div>`;
                chatBody.appendChild(botMessage);
            });

            // Scroll to the bottom
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error
            // Remove loading animation
            chatBody.removeChild(loadingMessage);

            // Append bot message with error
            const botMessage = document.createElement('div');
            botMessage.classList.add('chat-message', 'bot');
            botMessage.innerHTML = `<div class="message">Error: Failed to fetch response from API.</div>`;
            chatBody.appendChild(botMessage);

            // Scroll to the bottom
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }
}

// Gestione dell'evento keypress nel textarea per inviare il messaggio con Invio
const chatInput = document.getElementById('chat-input');
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Evita che il carattere di nuova linea venga aggiunto al textarea
        sendMessage(); // Chiama la funzione sendMessage() quando si preme Invio
    }
});

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function formatMessage(text) {
    return text.replace(/\n/g, '<br>');
}

window.onload = function() {
    getOrGenerateGUID();
};

// Gestione dell'evento unload per eliminare il GUID quando la finestra viene chiusa
window.addEventListener('beforeunload', function() {
    clearGUID();
});
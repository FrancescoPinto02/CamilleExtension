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

        // Make API call
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            // Remove loading animation
            chatBody.removeChild(loadingMessage);

            // Append bot message with API response
            const postTitle = data[0].title; // Get the title of the first post
            const botMessage = document.createElement('div');
            botMessage.classList.add('chat-message', 'bot');
            botMessage.innerHTML = `<div class="message">${postTitle}</div>`;
            chatBody.appendChild(botMessage);

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

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

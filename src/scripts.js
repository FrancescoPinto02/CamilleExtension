const vscode = acquireVsCodeApi(); //VsCode API

//GUID (UUID) Generation
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//Obtain the GUID or generate and save a GUID in localStorage
function getOrGenerateGUID() {
    let sender = localStorage.getItem('sender');
    if (!sender) {
        sender = generateGUID();
        localStorage.setItem('sender', sender);
    }
    return sender;
}

//Remove GUID from localStorage
function clearGUID() {
    localStorage.removeItem('sender');
}

//Generate GUID on a new window
window.onload = function() {
    getOrGenerateGUID();
};

//Remove GUID when closing window
window.addEventListener('beforeunload', function() {
    clearGUID();
});

//SendMessage to chatbot
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

        const sender = getOrGenerateGUID(); //Get or Generate GUID

        // Make API call to Rasa Chatbot
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

            //Manage the response
            data.forEach(botResponse => {
                //HTML report response
                if (botResponse.text && botResponse.text.startsWith("<!DOCTYPE html>")) {
                    const reportContainer = document.createElement('div');
                    reportContainer.classList.add('report-container');
                    reportContainer.innerHTML = `
                        <div class="report">
                            <iframe srcdoc="${botResponse.text.replace(/"/g, '&quot;')}"></iframe>
                        </div>
                        <button class="download-btn" onclick="downloadReport('${encodeURIComponent(botResponse.text)}')">
                            <i class="fas fa-download"></i>
                        </button>`;
                    chatBody.appendChild(reportContainer);
                } else { //Generic Response
                    const botMessage = document.createElement('div');
                    botMessage.classList.add('chat-message', 'bot');
                    botMessage.innerHTML = `<div class="message">${formatMessage(botResponse.text)}</div>`;
                    chatBody.appendChild(botMessage);
                }
            });

            // Scroll to the bottom
            chatBody.scrollTop = chatBody.scrollHeight;
            // Highlight code blocks in the new messages
            hljs.highlightAll();
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

// Press Enter to send Message
const chatInput = document.getElementById('chat-input');
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function formatMessage(text) {
    // python code blocks pattern
    const codeBlockPattern = /```python([\s\S]*?)```/g;
    let formattedText = '';
    let lastIndex = 0;

    text.replace(codeBlockPattern, (match, code, offset) => {
        formattedText += text.slice(lastIndex, offset).replace(/\n/g, '<br>');
        //Add copy button for code block
        formattedText += `<div class="code-container">
                            <button class="copy-btn" onclick="copyToClipboard(this)"><i class="fas fa-copy"></i></button>
                            <pre><code class="language-python">${code}</code></pre>
                        </div>`;
        lastIndex = offset + match.length;
    });

    formattedText += text.slice(lastIndex).replace(/\n/g, '<br>');

    return formattedText;
}


//Copy code to clipboard
function copyToClipboard(button) {
    const code = button.nextElementSibling.innerText;
    navigator.clipboard.writeText(code).then(() => {
        //Success Animation
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
        }, 1000);
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

//Download the report
function downloadReport(encodedContent) {
    const decodedContent = decodeURIComponent(encodedContent);
    
    //Send a message to VsCode API
    vscode.postMessage({
        command: 'downloadReport',
        content: decodedContent
    });
}
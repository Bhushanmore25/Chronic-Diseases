const chatForm = document.getElementById('chatForm');
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');

function appendMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);
  if (sender === 'bot') {
    messageDiv.innerHTML = text;
  } else {
    messageDiv.textContent = text;
  }

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();

  if (!message) return;

  appendMessage(message, 'user');

  userInput.value = '';

  try {
    const response = await fetch('/main/testyourself', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });

    const result = await response.json();

    appendMessage(result.response || 'No response from AI.', 'bot');
  } catch (err) {
    appendMessage('Error communicating with the AI. Please try again.', 'bot');
  }
});

import './style.css'
import { db } from './firebase'
import { ref, push, onValue } from 'firebase/database'

const currentUser = JSON.parse(localStorage.getItem('chatUser'))

if (!currentUser) {
  window.location.href = '/'
}

document.querySelector('#app').innerHTML = `
  <main class="wrap">
    <div class="top-bar">
      <h1>Public Chat</h1>
      <button id="logoutBtn" class="logout-btn">Logout</button>
    </div>

    <p id="currentUserText">User: ${escapeHtml(currentUser.username)}</p>

    <div class="form">
      <input id="messageInput" type="text" placeholder="Type a message..." maxlength="200" />
      <button id="sendBtn">Send</button>
    </div>

    <div id="messages" class="messages"></div>
  </main>
`

const messageInput = document.querySelector('#messageInput')
const sendBtn = document.querySelector('#sendBtn')
const logoutBtn = document.querySelector('#logoutBtn')
const messagesDiv = document.querySelector('#messages')

const messagesRef = ref(db, 'messages')

sendBtn.addEventListener('click', sendMessage)
logoutBtn.addEventListener('click', logoutUser)

messageInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await sendMessage()
  }
})

async function sendMessage() {
  const text = messageInput.value.trim()
  if (!text) return

  await push(messagesRef, {
    userId: currentUser.userId,
    username: currentUser.username,
    text,
    createdAt: Date.now()
  })

  messageInput.value = ''
}

function logoutUser() {
  localStorage.removeItem('chatUser')
  window.location.href = '/'
}

onValue(messagesRef, (snapshot) => {
  const data = snapshot.val()
  messagesDiv.innerHTML = ''

  if (!data) return

  const messages = Object.entries(data)
    .map(([id, msg]) => ({ id, ...msg }))
    .sort((a, b) => a.createdAt - b.createdAt)

  for (const msg of messages) {
    const item = document.createElement('div')
    item.className = 'message'

    const time = new Date(msg.createdAt).toLocaleString()

    item.innerHTML = `
      <div class="meta">${escapeHtml(msg.username)} • ${time}</div>
      <div>${escapeHtml(msg.text)}</div>
    `

    messagesDiv.appendChild(item)
  }
})

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
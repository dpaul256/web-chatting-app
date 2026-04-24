import './css/base.css'
import './css/chat.css'
import { db } from './firebase'
import { ref, push, onValue } from 'firebase/database'

const currentUser = JSON.parse(localStorage.getItem('chatUser'))

if (!currentUser) {
  window.location.href = `${import.meta.env.BASE_URL}index.html`
}

document.querySelector('#app').innerHTML = `
  <main class="wrap">
    <div class="top-bar">
      <div class="title-row">
        <h1>Public Chat /</h1>
        <span class="current-user-name">
          ${escapeHtml(currentUser.username)}
        </span>
      </div>

      <div class="action-buttons">
        <button id="myBlogBtn" class="blog-btn">Blog</button>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </div>  
    <div id="messages" class="messages"></div>
    
  </main>
  <div class="form">
    <input id="messageInput" type="text" placeholder="Type a message..." maxlength="200" />
    <button id="sendBtn">Send</button>
  </div>
`

const messageInput = document.querySelector('#messageInput')
const sendBtn = document.querySelector('#sendBtn')
const logoutBtn = document.querySelector('#logoutBtn')
const messagesDiv = document.querySelector('#messages')
const myBlogBtn = document.getElementById('myBlogBtn')

const messagesRef = ref(db, 'messages')

sendBtn.addEventListener('click', sendMessage)
logoutBtn.addEventListener('click', logoutUser)
myBlogBtn.addEventListener('click', () => {
  window.location.href = `${import.meta.env.BASE_URL}blog.html?user=${encodeURIComponent(currentUser.username)}`
})

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
  window.location.href = `${import.meta.env.BASE_URL}index.html`
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
      <div class="meta">
        <a 
          class="user-link"
          href="${import.meta.env.BASE_URL}blog.html?user=${encodeURIComponent(msg.username)}"
        >
          ${escapeHtml(msg.username)}
        </a>
        • ${time}
      </div>
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
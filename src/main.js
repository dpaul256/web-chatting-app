// import './style.css'
// import { db } from './firebase'
// import { ref, push, onValue } from 'firebase/database'

// document.querySelector('#app').innerHTML = `
//   <main class="wrap">
//     <h1>Public Chat</h1>

//     <div class="form">
//       <input id="nameInput" type="text" placeholder="Your name" maxlength="20" />
//       <input id="messageInput" type="text" placeholder="Type a message..." maxlength="200" />
//       <button id="sendBtn">Send</button>
//     </div>

//     <div id="messages" class="messages"></div>
//   </main>
// `

// const nameInput = document.querySelector('#nameInput')
// const messageInput = document.querySelector('#messageInput')
// const sendBtn = document.querySelector('#sendBtn')
// const messagesDiv = document.querySelector('#messages')

// const messagesRef = ref(db, 'messages')

// async function sendMessage() {
//   const name = nameInput.value.trim() || 'Anonymous'
//   const text = messageInput.value.trim()

//   if (!text) return

//   await push(messagesRef, {
//     name,
//     text,
//     createdAt: Date.now()
//   })

//   messageInput.value = ''
// }

// sendBtn.addEventListener('click', sendMessage)

// messageInput.addEventListener('keydown', async (e) => {
//   if (e.key === 'Enter') {
//     await sendMessage()
//   }
// })

// onValue(messagesRef, (snapshot) => {
//   const data = snapshot.val()
//   messagesDiv.innerHTML = ''

//   if (!data) return

//   const messages = Object.entries(data)
//     .map(([id, msg]) => ({ id, ...msg }))
//     .sort((a, b) => a.createdAt - b.createdAt)

//   for (const msg of messages) {
//     const item = document.createElement('div')
//     item.className = 'message'

//     const time = new Date(msg.createdAt).toLocaleString()

//     item.innerHTML = `
//       <div class="meta">${escapeHtml(msg.name)} • ${time}</div>
//       <div>${escapeHtml(msg.text)}</div>
//     `

//     messagesDiv.appendChild(item)
//   }
// })

// function escapeHtml(str) {
//   const div = document.createElement('div')
//   div.textContent = str
//   return div.innerHTML
// }

document.querySelector('#app').innerHTML = '<h1>Hello world</h1>'
import './style.css'
import { db } from './firebase'
import { ref, push, get, query, orderByChild, equalTo } from 'firebase/database'

document.querySelector('#app').innerHTML = `
  <main class="wrap">
    <h1>Login / Register</h1>

    <div class="form">
      <input id="usernameInput" type="text" placeholder="Username" maxlength="20" />
      <input id="passwordInput" type="password" placeholder="Password" maxlength="50" />
      <button id="registerBtn">Register</button>
      <button id="loginBtn">Login</button>
    </div>

    <p id="statusText"></p>
  </main>
`

const usernameInput = document.querySelector('#usernameInput')
const passwordInput = document.querySelector('#passwordInput')
const registerBtn = document.querySelector('#registerBtn')
const loginBtn = document.querySelector('#loginBtn')
const statusText = document.querySelector('#statusText')

const usersRef = ref(db, 'users')

registerBtn.addEventListener('click', registerUser)
loginBtn.addEventListener('click', loginUser)

async function registerUser() {
  try {
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if (!username || !password) {
      statusText.textContent = 'Please enter username and password'
      return
    }

    statusText.textContent = 'Registering...'

    const userQuery = query(usersRef, orderByChild('username'), equalTo(username))
    const snapshot = await get(userQuery)

    if (snapshot.exists()) {
      statusText.textContent = 'Username already exists'
      return
    }

    await push(usersRef, {
      username,
      password,
      createdAt: Date.now()
    })

    statusText.textContent = 'Register success'
  } catch (error) {
    console.error('register error:', error)
    statusText.textContent = `Register failed: ${error.message}`
  }
}

async function loginUser() {
  const username = usernameInput.value.trim()
  const password = passwordInput.value.trim()

  if (!username || !password) {
    statusText.textContent = 'Please enter username and password'
    return
  }

  const userQuery = query(usersRef, orderByChild('username'), equalTo(username))
  const snapshot = await get(userQuery)

  if (!snapshot.exists()) {
    statusText.textContent = 'User not found'
    return
  }

  const users = snapshot.val()
  const userId = Object.keys(users)[0]
  const userData = users[userId]

  if (userData.password !== password) {
    statusText.textContent = 'Wrong password'
    return
  }

  const currentUser = {
    userId,
    username: userData.username
  }
  
  localStorage.setItem('chatUser', JSON.stringify(currentUser))
  window.location.href = './chat.html'
}
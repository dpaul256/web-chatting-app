import './css/base.css'
import './css/blog.css'
import { db } from './firebase'
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  onValue
} from 'firebase/database';

document.querySelector('#app').innerHTML = `<div class="chat-container">
    <div class="chat-card">
      <div class="top-bar">
        <div class="title-row">
          <h1 id="blogTitle">Personal Blog</h1>
        </div>

        <div class="actions">
          <a href="./chat.html" class="top-btn">Chat</a>
          <button id="editToggleBtn" class="top-btn" style="display:none;">Edit Blog</button>
        </div>
      </div>

      <div class="blog-profile-card">
        <h2 id="profileName"></h2>
      </div> 

      <div id="editorSection" class="blog-editor" style="display:none;">
        <input id="postTitleInput" type="text" placeholder="Post title..." />
        <textarea id="postContentInput" placeholder="Write your article..."></textarea>
        <button id="publishPostBtn" class="send-btn">Publish Post</button>
      </div>

      <div id="postsList" class="posts-list"></div>
    </div>
  </div>
`

const currentUser = JSON.parse(localStorage.getItem("chatUser"));
const params = new URLSearchParams(window.location.search);
const blogUser = params.get("user");

const blogTitle = document.getElementById("blogTitle");

const editorSection = document.getElementById("editorSection");
const editToggleBtn = document.getElementById("editToggleBtn");

const bioInput = document.getElementById("bioInput");
const postTitleInput = document.getElementById("postTitleInput");
const postContentInput = document.getElementById("postContentInput");
const publishPostBtn = document.getElementById("publishPostBtn");

const postsList = document.getElementById("postsList");

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString("zh-TW");
}

if (!blogUser) {
  blogTitle.textContent = "Blog Not Found";
  postsList.innerHTML = `<div class="message-card">Missing user parameter.</div>`;
  throw new Error("Missing user parameter");
}

const isOwner = currentUser && currentUser.username === blogUser;

console.log(currentUser);
console.log(currentUser?.username);

blogTitle.textContent = `${blogUser}'s Blog`;

if (isOwner) {
  editToggleBtn.style.display = "inline-block";
}

editToggleBtn.addEventListener("click", () => {
  editorSection.style.display =
    editorSection.style.display === "none" ? "grid" : "none";
});

publishPostBtn.addEventListener("click", async () => {
  if (!isOwner) return;

  const title = postTitleInput.value.trim();
  const content = postContentInput.value.trim();

  if (!title || !content) {
    alert("Please fill in title and content.");
    return;
  }

  await push(ref(db, `posts/${blogUser}`), {
    title,
    content,
    createdAt: Date.now()
  });

  postTitleInput.value = "";
  postContentInput.value = "";
  alert("Post published.");
});

function renderPosts(postsObj) {
  const posts = postsObj
    ? Object.entries(postsObj).map(([id, post]) => ({ id, ...post }))
    : [];

  posts.sort((a, b) => b.createdAt - a.createdAt);

  if (posts.length === 0) {
    postsList.innerHTML = `
      <div class="message-card">
        No posts yet.
      </div>
    `;
    return;
  }

  postsList.innerHTML = posts.map(post => `
    <div class="message-card blog-post-card">
      <div class="post-meta">${formatTime(post.createdAt)}</div>
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <div class="post-content">${escapeHtml(post.content).replace(/\n/g, "<br>")}</div>
    </div>
  `).join("");
}

function listenPosts() {
  const postsRef = ref(db, `posts/${blogUser}`);
  onValue(postsRef, (snapshot) => {
    renderPosts(snapshot.val());
  });
}

listenPosts();
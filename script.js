// =========================
// INIT (JALANKAN SAAT LOAD)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  displayTime();
  loadTasks();
  loadLinks();

  const theme = localStorage.getItem("theme") || "light";
  document.body.className = theme;
});

// =========================
// GREETING + DATETIME
// =========================
function updateDateTime() {
  const now = new Date();

  document.getElementById("datetime").textContent =
    now.toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const hour = now.getHours();
  let greet = "Selamat Malam";

  if (hour < 12) greet = "Selamat Pagi";
  else if (hour < 18) greet = "Selamat Siang";
  else if (hour < 21) greet = "Selamat Sore";

  const name = localStorage.getItem("username") || "Pengguna";
  document.getElementById("greeting").textContent = `${greet}, ${name}!`;
}

// update tiap detik
setInterval(updateDateTime, 1000);

function saveName() {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) return;
  localStorage.setItem("username", name);
  updateDateTime();
}

// =========================
// FOCUS TIMER
// =========================
let timer = null;
let timeLeft = 25 * 60;

function displayTime() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  document.getElementById("time").textContent =
    `${m}:${s.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      displayTime();
    } else {
      clearInterval(timer);
      timer = null;
      alert("Sesi fokus selesai!");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  stopTimer();
  timeLeft = 25 * 60;
  displayTime();
}

// =========================
// TO-DO LIST
// =========================
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = task.text;

    if (task.done) text.style.textDecoration = "line-through";

    text.onclick = () => {
      task.done = !task.done;
      saveTasks(tasks);
    };

    const del = document.createElement("button");
    del.textContent = "Hapus";
    del.onclick = (e) => {
      e.stopPropagation(); // penting!
      tasks.splice(i, 1);
      saveTasks(tasks);
    };

    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
    alert("Task sudah ada!");
    return;
  }

  tasks.push({ text, done: false });
  saveTasks(tasks);
  input.value = "";
}

// =========================
// QUICK LINKS
// =========================
function loadLinks() {
  const links = JSON.parse(localStorage.getItem("links")) || [];
  const list = document.getElementById("linkList");
  list.innerHTML = "";

  links.forEach((link, i) => {
    const wrapper = document.createElement("div");

    const btn = document.createElement("a");
    btn.textContent = link.name;
    btn.href = link.url;
    btn.target = "_blank";

    const del = document.createElement("button");
    del.textContent = "Hapus";
    del.onclick = () => {
      links.splice(i, 1);
      localStorage.setItem("links", JSON.stringify(links));
      loadLinks();
    };

    wrapper.appendChild(btn);
    wrapper.appendChild(del);
    list.appendChild(wrapper);
  });
}

function addLink() {
  let name = document.getElementById("linkName").value.trim();
  let url = document.getElementById("linkURL").value.trim();

  if (!name || !url) return;

  if (!url.startsWith("http")) url = "https://" + url;

  const links = JSON.parse(localStorage.getItem("links")) || [];
  links.push({ name, url });

  localStorage.setItem("links", JSON.stringify(links));

  document.getElementById("linkName").value = "";
  document.getElementById("linkURL").value = "";

  loadLinks();
}

// =========================
// THEME
// =========================
function toggleTheme() {
  const theme = document.body.classList.contains("dark") ? "light" : "dark";
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}
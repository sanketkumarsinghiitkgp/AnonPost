const API_URL = "http://localhost:5000/posts";
const form = document.querySelector("form");
const loading = document.getElementById("gif");
const messageBoard = document.querySelector(".posts");

loading.style.display = "";
listAllPosts(0);

form.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form);

  const name = formData.get("name");
  const message = formData.get("message");
  const post = {
    name,
    message
  };
  loading.style.display = "";
  form.style.display = "none";
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(res => res.json())
    .then(postedPost => {
      form.reset();
      form.style.display = "";
      listAllPosts(1);
    });
});

function listAllPosts(toponly) {
  messageBoard.innerHTML = "";
  fetch(API_URL)
    .then(res => res.json())
    .then(posts => {
      posts.reverse();
      c = -1;
      if (toponly === 1) c = 1;
      posts.forEach(post => {
        const div = document.createElement("div");
        if (c != 0) {
          if (c == 1) c = 0;
          div.className = "post animated slideInLeft ";
        } else div.className = "post";
        const header = document.createElement("h3");
        header.textContent = post.name;
        const message = document.createElement("p");
        message.textContent = post.message;
        const date = document.createElement("small");
        date.textContent = new Date(post.created);
        div.appendChild(header);
        div.appendChild(message);
        div.appendChild(date);
        messageBoard.appendChild(div);
        loading.style.display = "none";
      });
    });
}

const express = require("express");
const cors = require("cors");
const app = express();
const monk = require("monk");
const db = monk("localhost/anonpost");
const Filter = require("bad-words");
const filter = new Filter();
const posts = db.get("posts"); //posts is a mongodb collection
const rateLimit = require("express-rate-limit");

app.use(cors());
app.use(express.json());

port = 5000;
/*HTML 5 buttons are submit buttons by default. To override ... use type="button"*/
/* a separate live-server is used so that CDN's huge cache is utilised*/
/*Remember how to handle cors error*/
/*Joi was not used for validation because only simple NOTNULL validation was required.*/
app.get("/", (req, res) => {
  res.json({
    message: "Loll"
  });
});
function isValidPost(post) {
  if (
    post.name.toString().trim() === "" ||
    post.message.toString().trim() === ""
  )
    return false;
  return true;
}
app.get("/posts", (req, res) => {
  posts.find().then(posts => {
    res.json(posts);
  });
});
app.use(
  rateLimit({
    windowMs: 10 * 1000,
    max: 1
  })
);
app.post("/posts", (req, res) => {
  if (isValidPost(req.body)) {
    //database insertion
    const post = {
      name: filter.clean(req.body.name.toString()),
      message: filter.clean(req.body.message.toString()),
      created: new Date()
    };
    posts.insert(post).then(postedPost => {
      res.json(postedPost);
    });
  } else {
    res.status(422);
    res.json({
      message:
        "Post is not valid. Please check if the name and message are entered properly."
    });
  }
});
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

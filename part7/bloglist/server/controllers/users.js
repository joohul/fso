const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

usersRouter.post("/", (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  bcrypt
    .hash(password, saltRounds)
    .then((passwordHash) => {
      const user = new User({
        username,
        name,
        passwordHash,
      });
      return user.save();
    })
    .then((savedUser) => {
      response.status(201).json(savedUser);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
      }
      if (error.name === "MongoServerError") {
        return response.status(400).json({ error: error.message });
      }
      response.status(500).json({ error: "something went wrong" });
    });
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});

  const usersAndBlogs = await Promise.all(
    users.map(async (user) => {
      const blogs = await Blog.find({ user: user._id });
      const userBlogs = blogs.map((b) => ({
        url: b.url,
        title: b.title,
        author: b.author,
        id: b._id.toString(),
      }));

      return {
        username: user.username,
        name: user.name,
        id: user._id.toString(),
        blogs: userBlogs,
      };
    }),
  );
  response.json(usersAndBlogs);
});

module.exports = usersRouter;

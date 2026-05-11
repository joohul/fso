const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  return blogs[likes.indexOf(Math.max(...likes))];
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const count = Array(authors.length).fill(0);
  authors.forEach((author) => {
    count[authors.indexOf(author)] = count[authors.indexOf(author)] + 1;
  });
  return {
    author: authors[count.indexOf(Math.max(...count))],
    blogs: Math.max(...count),
  };
};

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const likes = Array(authors.length).fill(0);
  blogs.forEach((blog) => {
    likes[authors.indexOf(blog.author)] =
      likes[authors.indexOf(blog.author)] + blog.likes;
  });
  return {
    author: authors[likes.indexOf(Math.max(...likes))],
    likes: Math.max(...likes),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};

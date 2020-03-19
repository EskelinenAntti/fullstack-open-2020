const Blog = require('../models/blog')
const mongoose = require('mongoose')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
]

const singleBlogInDb = async () => {
  const initialBlogs = await blogsInDb()
  return initialBlogs[0]
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const notExistingId = async () => {
  const blog = new Blog({
    title: 'remove',
    author: 'remove',
    url: 'remove',
    likes: 0
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

module.exports = {
  initialBlogs, blogsInDb, singleBlogInDb, notExistingId
}
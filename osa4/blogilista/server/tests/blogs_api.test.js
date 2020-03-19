const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogHelper = require('./blog_test_helper')
const userHelper = require('./user_test_helper')
const app = require('../app')

const api = supertest(app)

const linkUserAndBlogs = async () => {

  const user = await userHelper.singleUserInDb()
  const blogs = await blogHelper.blogsInDb()

  user.blogs = blogs.map(blog => blog._id)

  user.save()
  await Blog.updateMany({}, { $set: { user: user._id } })
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await Blog.insertMany(blogHelper.initialBlogs)
  await User.insertMany(userHelper.initialUsers)
  await linkUserAndBlogs()
})

describe('The get method ', () => {

  test('returns blogs as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogHelper.initialBlogs.length)
  })

  test('have \'id\' as identifying field', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog =>
      expect(blog.id).toBeDefined())
  })
})

describe('The post method ', () => {
  test('can add a new blog', async () => {

    const newBlog = {
      title: 'JeeJee blogi',
      author: 'Antti Eskelinen',
      url: 'http://jeejee.com',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${await userHelper.getToken()}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogHelper.blogsInDb()

    expect(blogs.length).toBe(blogHelper.initialBlogs.length + 1)

  })

  test('sets likes to 0 if they are missing from the request', async () => {
    const blogWithoutLikes = {
      title: 'JeeJee blogi',
      author: 'Antti Eskelinen',
      url: 'http://jeejee.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .set('Authorization', `bearer ${await userHelper.getToken()}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('returns 400 if blog is missing title', async () => {
    const blogWithoutTitle = {
      author: 'Antti Eskelinen',
      url: 'http://jeejee.com',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .set('Authorization', `bearer ${await userHelper.getToken()}`)
      .expect(400)
  })

  test('returns 400 if blog is missing url', async () => {
    const blogWithoutUrl = {
      title: 'JeeJee blogi',
      author: 'Antti Eskelinen',
      likes: 101
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .set('Authorization', `bearer ${await userHelper.getToken()}`)
      .expect(400)
  })

  test('returns 401 if token is missing from request', async () => {
    const newBlog = {
      title: 'JeeJee blogi',
      author: 'Antti Eskelinen',
      url: 'http://jeejee.com',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogs = await blogHelper.blogsInDb()
    expect(blogHelper.initialBlogs.length).toBe(blogs.length)
  })
})

describe('The delete method', () => {

  test('can delete a blog', async () => {
    const initialBlogs = await blogHelper.blogsInDb()
    const deletedBlog = await blogHelper.singleBlogInDb()

    await api
      .delete(`/api/blogs/${deletedBlog.id}`)
      .set('Authorization', `bearer ${await userHelper.getToken()}`)
      .expect(204)

    const blogsAfterDeletion = await blogHelper.blogsInDb()
    expect(blogsAfterDeletion.length).toBe(initialBlogs.length - 1)
    expect(blogsAfterDeletion.map(blog => blog.title)).not.toContain(deletedBlog.title)
  })
})

describe('The put method', () => {

  test('can update a blog', async () => {
    const updatedBlog = await blogHelper.singleBlogInDb()
    updatedBlog.likes += 1

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)

    expect(await blogHelper.singleBlogInDb()).toEqual(updatedBlog)
  })

  test('does not update blog if required field is missing', async () => {
    const updatedBlog = await blogHelper.singleBlogInDb()
    delete updatedBlog.url

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(400)

    const blogAfter = await blogHelper.singleBlogInDb()
    expect(blogAfter.url).toBeDefined()

  })

  test('returns 404 if blog is not found', async () => {
    const notExistingId = await blogHelper.notExistingId()

    const body = await blogHelper.singleBlogInDb()

    await api
      .put(`/api/blogs/${notExistingId}`)
      .send(body)
      .expect(404)
  })

  test('returns 400 if id is invalid', async () => {
    const invalidId = 'id'
    const body = await blogHelper.singleBlogInDb()

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(body)
      .expect(400)

  })

})

afterAll(() => {
  mongoose.connection.close()
})
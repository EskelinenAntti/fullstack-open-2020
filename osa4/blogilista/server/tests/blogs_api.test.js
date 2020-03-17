const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('../tests/test_helper')

const app = require('../app')

const api = supertest(app)



beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.intialBlogs)
})

describe('The get method ', () => {

  test('returns blogs as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(6)
  })

  test('have \'id\' as identifying field', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog =>
      expect(blog.id).toBeDefined())
  })
})

describe('The post method ', () => {
  test('add a new blog', async () => {
    const newBlog = {
      title: 'JeeJee blogi',
      author: 'Antti Eskelinen',
      url: 'http://jeejee.com',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()

    expect(blogs.length).toBe(helper.intialBlogs.length + 1)

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
      .expect(400)
  })
})

describe('The delete method', () => {

  test('can delete a blog', async () => {
    const initialBlogs = await helper.blogsInDb()
    const deletedBlog = await helper.singleBlogInDb()

    await api
      .delete(`/api/blogs/${deletedBlog.id}`)
      .expect(204)

    const blogsAfterDeletion = await helper.blogsInDb()
    expect(blogsAfterDeletion.length).toBe(initialBlogs.length - 1)
    expect(blogsAfterDeletion.map(blog => blog.title)).not.toContain(deletedBlog.title)
  })
})

describe('The put method', () => {

  test('can update a blog', async () => {
    const updatedBlog = await helper.singleBlogInDb()
    updatedBlog.likes += 1

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)

    expect(await helper.singleBlogInDb()).toEqual(updatedBlog)
  })

  test('does not update blog if required field is missing', async () => {
    const updatedBlog = await helper.singleBlogInDb()
    delete updatedBlog.url

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(400)

    const blogAfter = await helper.singleBlogInDb()
    expect(blogAfter.url).toBeDefined()

  })

  test('returns 404 if blog is not found', async () => {
    const notExistingId = await helper.notExistingId()

    const body = await helper.singleBlogInDb()

    await api
      .put(`/api/blogs/${notExistingId}`)
      .send(body)
      .expect(404)
  })

  test('returns 400 if id is invalid', async () => {
    const invalidId = 'id'
    const body = await helper.singleBlogInDb()

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(body)
      .expect(400)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./user_test_helper')

const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('The POST method', () => {
  test('can create users', async () => {

    const initialUsers = await helper.usersInDb()

    const newUser = {
      'name': 'Pertti',
      'username': 'pena',
      'password': 'jeejejej'
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(201)

    const users = await helper.usersInDb()
    expect(users.length).toBe(initialUsers.length + 1)
  })

  test('returns 400 if password is too short', async () => {

    const newUser = {
      'name': 'Pertti',
      'username': 'pena',
      'password': 'je'
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)

    const usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(helper.initialUsers.length)

  })

  test('returns 400 if username is not unique', async () => {

    const existingUser = await helper.singleUserInDb()

    const duplicateUsername = {
      username: existingUser.username,
      name: 'Dupl Duplicate',
      password: 'password'
    }

    await api
      .post('/api/users/')
      .send(duplicateUsername)
      .expect(400)

    const usersInDb = await helper.usersInDb()
    expect(usersInDb.length).toBe(helper.initialUsers.length)

  })
})

afterAll(() => {
  mongoose.connection.close()
})
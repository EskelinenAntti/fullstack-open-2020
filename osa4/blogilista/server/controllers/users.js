const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

const isInvalidPassword = (password) => !password || password.length < 3

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (isInvalidPassword(body.password)) {
    return response.status(400).json(
      { error: 'User must have password that is atleast 3 characters long.' }
    )
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser.toJSON())
})

usersRouter.get('/', async (request, response) => {
  const user = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(user.map(user => user.toJSON()))
})

module.exports = usersRouter
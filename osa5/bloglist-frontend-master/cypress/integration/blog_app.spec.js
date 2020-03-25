const user = {
  name: 'Testi Testinen',
  username: 'testi',
  password: 'testi123'
}

const blog = {
  title: 'testBlog',
  author: 'testAuthor',
  url: 'testUrl'
}

describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('button').contains('login').click()
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login',function() {

    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
      cy.contains('logged in')
      cy.get('#logged-user-content').should('exist')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('Invalid credentials')
      cy.get('html').should('not.contain', 'logged in')
      cy.get('#logged-user-content').should('not.exist')

    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login(user)
    })

    it('a blog can be created', function() {
      cy.contains('add blog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#create-blog-button').click()

      cy.contains(blog.title)
      cy.contains(blog.author)
    })

    it('an existing blog can be liked', function() {
      cy.createBlog(blog)

      cy.contains(blog.title).contains('show').click()
      cy.contains('likes: 0')
      cy.contains(blog.title)
        .parent()
        .find('button')
        .contains('like')
        .click()
      cy.contains('likes: 1')
    })

    it('an owned blog can be deleted', function() {
      cy.createBlog(blog)

      cy.contains(blog.title).contains('show').click()
      cy.contains(blog.title)
        .parent()
        .find('button')
        .contains('remove')
        .click()
      cy.get('html').should('not.contain', blog.title)
    })

    it('blogs are returned arranged by likes', function() {

      const blog1 = { ...blog, likes: 0 }
      const blog2 = { ...blog, likes: 3 }
      const blog3 = { ...blog, likes: 2 }

      blog1.likes = 0
      blog2.likes = 3
      blog3.likes = 2

      cy.createBlog(blog1, blog2, blog3)

      cy.get('.show-blog-button').then( buttons => {
        for (let i = 0; i< buttons.length; i++) {
          cy.wrap(buttons[i]).click()
        }
      })

      cy.get('.blog').then( blogs => {
        cy.wrap(blogs[0]).contains('likes: 3')
        cy.wrap(blogs[1]).contains('likes: 2')
        cy.wrap(blogs[2]).contains('likes: 0')
      })

    })
  })
})
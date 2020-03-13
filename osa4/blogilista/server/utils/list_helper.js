const logger = require('./logger')

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => (likes += blog.likes), 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    logger.info('blogs was empty')
    return
  }

  const firstBlog = blogs[0]

  const favouriteBlog = blogs
    .slice(1)
    .reduce((currentFavourite, blog) =>
      (blog.likes > currentFavourite.likes ? blog : currentFavourite),
    firstBlog)

  return (
    {
      title: favouriteBlog.title,
      author: favouriteBlog.author,
      likes: favouriteBlog.likes
    }
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    logger.info('blogs was empty')
    return
  }

  const blogCountByAuthor = {}
  blogs.forEach(blog => {
    if (blogCountByAuthor[blog.author]){
      blogCountByAuthor[blog.author].blogs += 1
    } else {
      blogCountByAuthor[blog.author] = { author: blog.author, blogs: 1 }
    }
  })

  const authors = Object.values(blogCountByAuthor)
  return findAuthorWithMost('blogs',  authors)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    logger.info('blogs was empty')
    return
  }

  const blogCountByAuthor = {}
  blogs.forEach(blog => {
    if (blogCountByAuthor[blog.author]){
      blogCountByAuthor[blog.author].likes += blog.likes
    } else {
      blogCountByAuthor[blog.author] = { author: blog.author, likes: blog.likes }
    }
  })

  const authors = Object.values(blogCountByAuthor)
  return findAuthorWithMost('likes',  authors)
}

const findAuthorWithMost = (field, authors) => {
  const firstAuthor = authors[0]
  return authors
    .slice(1)
    .reduce((currentAuthorWithMost, author) =>
      (author[field] > currentAuthorWithMost[field] ? author : currentAuthorWithMost),
    firstAuthor)
}

module.exports =
  {
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
  }
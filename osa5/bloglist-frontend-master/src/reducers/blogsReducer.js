import blogService from '../services/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(
      {
        type: 'INITIALIZE_BLOGS',
        data: { blogs }
      }
    )
  }
}

export const addBlog = blog => {
  return async dispatch => {
    const resultBlog = await blogService.create(blog)
    dispatch({
      type: 'ADD_BLOG',
      data: { blog: resultBlog }
    })
  }
}

export const likeBlog = blog => {
  return async dispatch => {

    blog.likes += 1
    const resultBlog = await blogService.update(blog)
    dispatch({
      type: 'UPDATE_BLOG',
      data: { blog: resultBlog }
    })
  }
}

export const deleteBlog = blog => {
  return async dispatch => {
    await blogService.remove(blog)
    dispatch({
      type: 'DELETE_BLOG',
      data: { blog }
    })
  }
}

const sortByLikes = (blogs) => (
  blogs.sort((f,s) =>  s.likes - f.likes)
)

const blogsReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_BLOGS': {
      return sortByLikes(action.data.blogs)
    } case 'ADD_BLOG':
      return state.concat(action.data.blog)
    case 'UPDATE_BLOG': {
      let updatedBlog = action.data.blog
      let updatedBlogList = state.map(
        blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      return sortByLikes(updatedBlogList)
    }
    case 'DELETE_BLOG': {
      let deletedBlog = action.data.blog
      return state.filter(blog => blog.id !== deletedBlog.id)
    }
    default:
      return state
  }
}

export default blogsReducer
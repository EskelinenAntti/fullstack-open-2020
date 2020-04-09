import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginBottom: theme.spacing(1)
  }
}))

const Togglable = React.forwardRef((props, ref) => {

  const classes = useStyles()
  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => { setVisible(!visible) }

  const content = (
    <>
      {props.children}
      <Button color='secondary' onClick={() => setVisible(false)}>cancel</Button>
    </>
  )

  const hidden = <Button variant='contained' color='primary' className={classes.actionButton} onClick={() => setVisible(true)}>{props.buttonLabel}</Button>

  return (
    visible ? content : hidden
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => { setVisible(!visible) }

  const content = (
    <>
      {props.children}
      <button onClick={() => setVisible(false)}>cancel</button>
    </>
  )

  const hidden = <button onClick={() => setVisible(true)}>{props.buttonLabel}</button>

  return (
    visible ? content : hidden
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
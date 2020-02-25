import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({text, handleClick}) => (
  <button onClick={handleClick}>{text}</button>
)

const FeedbackStatistic = ({feedbackType, amount}) => (
  <p>{feedbackType} {amount}</p>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} handleClick={() => setGood(good+1)}/>
      <Button text={"neutral"} handleClick={() => setNeutral(neutral+1)}/>
      <Button text={"bad"} handleClick={() => setBad(bad+1)}/>
      <h1>statistics</h1>
      <FeedbackStatistic feedbackType={"good"} amount={good}/>
      <FeedbackStatistic feedbackType={"neutral"} amount={neutral}/>
      <FeedbackStatistic feedbackType={"bad"} amount={bad}/>
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)
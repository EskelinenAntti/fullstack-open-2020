import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => (
    <h1>{props.course}</h1>
);

const Content = (props) => (
    <>
      <Part part={props.parts[0]}/>
      <Part part={props.parts[1]}/>
      <Part part={props.parts[2]}/>
    </>
);

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = (props) => {
    let exercisesTotal = 0;
    props.parts.forEach(part => exercisesTotal += part.exercises);
    return (
      <p>
        Number of exercises {exercisesTotal}
      </p>
    );
};

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content
        parts={parts}
        />
      <Total parts={parts}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
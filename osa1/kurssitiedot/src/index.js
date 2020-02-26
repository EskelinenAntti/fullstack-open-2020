import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => (
    <h1>{props.course}</h1>
);

const Content = (props) => (
    <ul>
      {props.parts.map((part, i) =>
        <Part key={i} part={part} />
      )}
    </ul>
);

const Part = (props) => (
  <li>
    <p> {props.part.name} {props.part.exercises}</p>
  </li>
);

const Total = (props) => {
    const exercisesTotal =
      props.parts.reduce( (s, p) => s + p.exercises, 0)
    return (
      <b>
        Total of {exercisesTotal} exercises
      </b>
    );
};

const Course = ({course}) => {
  return (
    <div>
      <Header course={course.name} />
      <Content
        parts={course.parts}
        />
      <Total parts={course.parts}/>
    </div>
  );
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
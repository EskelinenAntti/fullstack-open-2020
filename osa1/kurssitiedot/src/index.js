import React from 'react'
import ReactDOM from 'react-dom'
import './index.css';

const Header = (props) => (
    <h1>{props.course}</h1>
);

const Content = (props) => (
    <ul>
      {props.parts.map((part) =>
        <Part key={part.id} part={part} />
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

const CoursesList = ({courses}) => (
    <ul>
      {courses.map((course) =>
        <Course key={course.id} course={course}/>
      )}
    </ul>
)



const Course = ({course}) => {
  return (
    <li>
      <Header course={course.name} />
      <Content
        parts={course.parts}
        />
      <Total parts={course.parts}/>
    </li>
  );
}

const App = () => {
  const courses = [
    {
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <CoursesList courses={courses} />
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
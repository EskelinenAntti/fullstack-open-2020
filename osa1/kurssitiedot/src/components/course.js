import React from 'react'

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

export default Course
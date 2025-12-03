import React from 'react';

const MyComponent = () => {
  const sayHello = () => {
    alert("Hello!")
  };

  return (
    <button onClick={sayHello}>Say Hello</button>
  );
};

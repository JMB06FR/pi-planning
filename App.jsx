// App.jsx - usable with your index.html (React & ReactDOM loaded from CDN,
// and Babel standalone transpiling this file in the browser)

const MyComponent = () => {
  const sayHello = () => {
    alert("Hello!");
  };

  return (
    <button onClick={sayHello}>Say Hello</button>
  );
};

// Mount the app into the #root element (React 18)
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<MyComponent />);
} else {
  console.error('No #root element found to mount the React app.');
}

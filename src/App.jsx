import { useState } from 'react';
import PostList from './components/PostList';

function App() {
  const [toggle, setToggle] = useState(true);
  return (
    <>
      <h2 className="title">MY POSTS</h2>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>

      {toggle && <PostList />}
    </>
  );
}

export default App;

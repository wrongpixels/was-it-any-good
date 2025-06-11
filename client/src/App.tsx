import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/film/:id" />
          </Routes>
        </Router>
      </div>
      <p className="read-the-docs">So it does update. </p>
    </>
  );
}

export default App;

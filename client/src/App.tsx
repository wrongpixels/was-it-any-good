import { JSX } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FilmEntry from './components/FilmEnty';

const App = (): JSX.Element => {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/film/:id" element={<FilmEntry />} />
          </Routes>
        </Router>
      </div>
      <p className="read-the-docs">So it does update. </p>
    </>
  );
};
export default App;

import { JSX } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FilmEntry from './components/FilmEntry';

const App = (): JSX.Element => {
  //const [count, setCount] = useState(0);

  return (
    <div className="w-screen min-h-screen flex justify-center bg-gray-100 p-4">
      <div className="p-4 bg-gray-50 rounded shadow max-w-4xl w-full ring ring-[#dfdfdf]">
        <Router>
          <Routes>
            <Route path="/film/:id" element={<FilmEntry />} />
            <Route path="/tmdb/:id" element={<FilmEntry tmdb={true} />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};
export default App;

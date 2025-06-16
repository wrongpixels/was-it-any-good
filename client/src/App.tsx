import { JSX } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MediaEntry from './components/MediaEntry';
import { MediaType } from '../../shared/types/media';

const App = (): JSX.Element => {
  //const [count, setCount] = useState(0);

  return (
    <div className="w-full">
      <div className="h-10 bg-[#5980c7] items-center flex justify-center sticky shadow-sm top-0">
        <div className="font-bold text-white text-2xl mb-1">
          WI★G
          <span className="font-normal italic ml-2 text-xl">
            Was It Any Good?
          </span>
        </div>
      </div>

      <div className="min-h-screen flex justify-center bg-gray-200 p-4 box-border">
        <div className="p-4 bg-gray-50 rounded shadow w-5xl min-w-xl ring ring-[#dfdfdf]">
          <Router>
            <Routes>
              <Route
                path="/film/:id"
                element={<MediaEntry mediaType={MediaType.Film} />}
              />
              <Route
                path="/show/:id"
                element={<MediaEntry mediaType={MediaType.Show} />}
              />
              <Route
                path="/tmdb/film/:id"
                element={<MediaEntry mediaType={MediaType.Film} tmdb={true} />}
              />
              <Route
                path="/tmdb/show/:id"
                element={<MediaEntry mediaType={MediaType.Show} tmdb={true} />}
              />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
};
export default App;

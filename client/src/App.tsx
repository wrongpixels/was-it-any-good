import { JSX } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MediaEntry from './components/Media/MediaEntry';
import { MediaType } from '../../shared/types/media';
import Header from './components/Header/Header';
import PersonEntry from './components/Person/PersonEntry';

const App = (): JSX.Element => {
  return (
    <div className="w-full">
      <Router>
        <Header />
        <div className="min-h-screen flex justify-center bg-gray-200 p-4 box-border">
          <div className="p-4 bg-gray-50 rounded shadow w-5xl min-w-xl ring ring-[#dfdfdf]">
            <Routes>
              <Route path="/" element={null} />
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
              <Route path="/person/:id" element={<PersonEntry />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};
export default App;

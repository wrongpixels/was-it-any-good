import { JSX } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MediaPage from './components/Media/MediaPage';
import { MediaType } from '../../shared/types/media';
import Header from './components/Header/Header';
import PersonPage from './components/Person/PersonPage';
import NotFound from './components/NotFound';
import { useAuth } from './hooks/use-auth';
import SigningInPage from './components/common/status/SigningInPage';
import SearchPage from './components/Search/SearchPage';
import BrowsePage from './components/Search/Browse/BrowsePage';

const App = (): JSX.Element => (
  <div className="w-full min-h-screen flex flex-col">
    <Router>
      <Header />
      <div className="flex-1 flex justify-center bg-gray-200 p-4 box-border">
        <div className="p-4 bg-gray-50 rounded shadow w-5xl min-w-xl ring ring-[#dfdfdf]">
          <AppBody />
        </div>
      </div>
    </Router>
  </div>
);

//auth sensitive
const AppBody = (): JSX.Element => {
  const { isLoginPending } = useAuth();
  if (isLoginPending) {
    return <SigningInPage />;
  }
  return (
    <Routes>
      <Route path="/" element={null} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route
        path="/film/:id"
        element={<MediaPage key="local-id" mediaType={MediaType.Film} />}
      />
      <Route
        path="/show/:id"
        element={<MediaPage key="local-id" mediaType={MediaType.Show} />}
      />
      <Route
        path="/tmdb/film/:id"
        element={
          <MediaPage key="tmdb-id" mediaType={MediaType.Film} tmdb={true} />
        }
      />
      <Route
        path="/tmdb/show/:id"
        element={
          <MediaPage key="tmdb-id" mediaType={MediaType.Show} tmdb={true} />
        }
      />
      <Route path="/person/:id" element={<PersonPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

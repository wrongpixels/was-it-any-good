import { JSX } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MediaEntry from './components/Media/MediaEntry';
import { MediaType } from '../../shared/types/media';
import Header from './components/Header/Header';
import PersonEntry from './components/Person/PersonEntry';
import NotFound from './components/NotFound';
import { useAuth } from './hooks/use-auth';
import SigningInPage from './components/common/status/SigningInPage';

const App = (): JSX.Element => (
  <div className="w-full">
    <Router>
      <Header />
      <div className="min-h-screen flex justify-center bg-gray-200 p-4 box-border">
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
      <Route
        path="/film/:id"
        element={<MediaEntry key="local-id" mediaType={MediaType.Film} />}
      />
      <Route
        path="/show/:id"
        element={<MediaEntry key="local-id" mediaType={MediaType.Show} />}
      />
      <Route
        path="/tmdb/film/:id"
        element={
          <MediaEntry key="tmdb-id" mediaType={MediaType.Film} tmdb={true} />
        }
      />
      <Route
        path="/tmdb/show/:id"
        element={
          <MediaEntry key="tmdb-id" mediaType={MediaType.Show} tmdb={true} />
        }
      />
      <Route path="/person/:id" element={<PersonEntry />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

import { JSX } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import MediaPage from './components/Media/MediaPage';
import { MediaType } from '../../shared/types/media';
import Header from './components/Header/Header';
import PersonPage from './components/Person/PersonPage';
import NotFound from './components/NotFound';
import { useAuth } from './hooks/use-auth';
import SigningInPage from './components/Common/Status/SigningInPage';
import SearchPage from './components/Search/SearchPage';
import BrowsePage from './components/Search/Browse/BrowsePage';
import NavBar from './components/NavBar/NavBar';
import ImageOverlay from './components/Overlay/ImageOverlay';
import {
  BrowsePageRouterData,
  browsePageRoutes,
} from './config/browsePageRoutes';
import Footer from './components/Footer/Footer';
import SignUpOverlay from './components/Overlay/SignUpOverlay';
import useScrollToTop from './hooks/use-scroll-to-top';
import HomePage from './components/Search/HomePage';
import { clientPaths } from '../../shared/util/url-builder';

const App = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-200">
      <Router>
        <SignUpOverlay />
        <ImageOverlay />
        <Header />

        <div className="flex flex-1 flex-col min-h-0 box-border mx-2">
          <NavBar />
          <div className="flex flex-col flex-1 min-h-0 bg-gray-50 rounded shadow ring ring-[#d6d6d6] w-full max-w-5xl mx-auto h-full">
            <div className="flex-1 min-h-0 h-full">
              <AppBody />
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
};

// auth sensitive part of the app
const AppBody = (): JSX.Element => {
  useScrollToTop();
  const { isLoginPending } = useAuth();
  const location = useLocation();

  if (isLoginPending) {
    return <SigningInPage />;
  }

  return (
    <div className="flex flex-col h-full min-h-0 p-8 pt-4 ">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path={clientPaths.search.base}
          element={<SearchPage key={location.search} />}
        />
        <Route path={clientPaths.browse.base} element={<BrowsePage />} />

        {browsePageRoutes.map((browseRoute: BrowsePageRouterData) => (
          <Route
            path={browseRoute.path}
            key={browseRoute.path}
            element={<BrowsePage {...browseRoute.browseProps} />}
          />
        ))}
        <Route
          path={clientPaths.films.idRoute()}
          element={<MediaPage mediaType={MediaType.Film} />}
        />
        <Route
          path={clientPaths.shows.idRoute()}
          element={<MediaPage mediaType={MediaType.Show} />}
        />
        <Route
          path={clientPaths.films.TMDBIdParam()}
          element={<MediaPage mediaType={MediaType.Film} tmdb={true} />}
        />
        <Route
          path={clientPaths.shows.TMDBIdParam()}
          element={<MediaPage mediaType={MediaType.Show} tmdb={true} />}
        />
        <Route path={clientPaths.people.idRoute()} element={<PersonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

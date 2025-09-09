import { JSX } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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
import { routerPaths } from './utils/url-helper';
import {
  BrowsePageRouterData,
  browsePageRoutes,
} from './config/browsePageRoutes';
import Footer from './components/Footer/Footer';
import SignUpOverlay from './components/Overlay/SignUpOverlay';
import useScrollToTop from './hooks/use-scroll-to-top';

const App = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-200">
      <Router>
        <SignUpOverlay />
        <ImageOverlay />
        <Header />
        <NavBar />
        <div className="flex flex-1 flex-col min-h-0 box-border">
          <div className="flex flex-col flex-1 min-h-0 bg-gray-50 rounded shadow ring ring-[#d6d6d6] w-full max-w-5xl mx-auto">
            <div className="flex-1 min-h-0">
              <AppBody />
            </div>
          </div>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

// auth sensitive part of the app
const AppBody = (): JSX.Element => {
  useScrollToTop();
  const { isLoginPending } = useAuth();

  if (isLoginPending) {
    return <SigningInPage />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-8 pt-4">
      <Routes>
        <Route path="/" element={<SearchPage isHome={true} />} />
        <Route path={routerPaths.search.base} element={<SearchPage />} />
        <Route path={routerPaths.browse.base} element={<BrowsePage />} />

        {browsePageRoutes.map((browseRoute: BrowsePageRouterData) => (
          <Route
            path={browseRoute.path}
            key={browseRoute.path}
            element={<BrowsePage {...browseRoute.browseProps} />}
          />
        ))}

        <Route
          path={routerPaths.films.idParam()}
          element={<MediaPage key="local-id" mediaType={MediaType.Film} />}
        />
        <Route
          path={routerPaths.shows.idParam()}
          element={<MediaPage key="local-id" mediaType={MediaType.Show} />}
        />
        <Route
          path={routerPaths.films.TMDBIdParam()}
          element={
            <MediaPage key="tmdb-id" mediaType={MediaType.Film} tmdb={true} />
          }
        />
        <Route
          path={routerPaths.shows.TMDBIdParam()}
          element={
            <MediaPage key="tmdb-id" mediaType={MediaType.Show} tmdb={true} />
          }
        />
        <Route path="/person/:id" element={<PersonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

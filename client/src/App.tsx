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
    <div className="w-full min-h-screen flex flex-col">
      <Router>
        <SignUpOverlay />
        <ImageOverlay />
        <Header />
        <div className="flex flex-1 flex-col items-center bg-gray-200 box-border">
          <NavBar />
          <div className="p-4 flex flex-col flex-1 start-1 bg-gray-50 rounded shadow w-5xl min-w-xl ring ring-[#d6d6d6]">
            <AppBody />
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
};

//auth sensitive part of the app
const AppBody = (): JSX.Element => {
  //a hook to auto-scroll on url changes
  useScrollToTop();
  const { isLoginPending } = useAuth();

  if (isLoginPending) {
    return <SigningInPage />;
  }
  console.log(routerPaths.trending.multi.base());
  return (
    <div className="mx-4 mb-4 flex flex-col flex-1">
      <Routes>
        <Route path="/" element={<SearchPage isHome={true} />} />
        <Route path={routerPaths.search.base} element={<SearchPage />} />
        <Route path={routerPaths.browse.base} element={<BrowsePage />} />

        {/*all our top/most popular etc routes live in a single array */}
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

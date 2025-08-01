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
import RankingBar from './components/NavBar/RankingBar';
import ImageOverlay from './components/Overlay/ImageOverlay';
import { routerPaths } from './utils/url-helper';
import { OrderBy } from '../../shared/types/browse';
import { SearchType } from '../../shared/types/search';

const App = (): JSX.Element => (
  <div className="w-full min-h-screen flex flex-col">
    <Router>
      <ImageOverlay />
      <Header />
      <div className="flex flex-1 flex-col items-center bg-gray-200 box-border">
        <RankingBar />
        <div className="p-4 mb-4 flex-1 start-1 bg-gray-50 rounded shadow w-5xl min-w-xl ring ring-[#d6d6d6]">
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
    <div className="mx-4 mb-4">
      <Routes>
        <Route path="/" element={null} />
        <Route path={routerPaths.search.base} element={<SearchPage />} />
        <Route path={routerPaths.browse.base} element={<BrowsePage />} />
        <Route
          path={routerPaths.popular.multi.base()}
          element={
            <BrowsePage
              searchType={SearchType.Multi}
              orderBy={OrderBy.Popularity}
            />
          }
        />
        <Route
          path={routerPaths.tops.multi.base()}
          element={
            <BrowsePage
              searchType={SearchType.Multi}
              orderBy={OrderBy.Rating}
            />
          }
        />
        <Route
          path={routerPaths.tops.films.base()}
          element={
            <BrowsePage searchType={SearchType.Film} orderBy={OrderBy.Rating} />
          }
        />
        <Route
          path={routerPaths.tops.shows.base()}
          element={
            <BrowsePage searchType={SearchType.Show} orderBy={OrderBy.Rating} />
          }
        />

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

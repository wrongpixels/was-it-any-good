import { JSX } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FilmEntry from "./components/FilmEntry";

const App = (): JSX.Element => {
  //const [count, setCount] = useState(0);

  return (
    <div className="w-screen min-h-screen flex justify-center items-start bg-gray-100 p-4">
      <Router>
        <Routes>
          <Route path="/film/:id" element={<FilmEntry />} />
        </Routes>
      </Router>
    </div>
  );
};
export default App;

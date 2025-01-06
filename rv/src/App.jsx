import NavBar from "./Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <NavBar />
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="/search" element={<Search />}></Route>
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;

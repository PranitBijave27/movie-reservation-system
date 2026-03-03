import Navbar from "../components/Navbar";
import "../styles/global.css";
import Hero from "../components/Hero";
import MovieSection from "../components/MovieSection";
import MovieDetails from "../pages/MovieDetails";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <MovieSection />
            </>
          }
        />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Routes>
    </>
  );
}

export default App;

import MovieCard from "./MovieCard";
import "../styles/movieSection.css";
import { useState ,useEffect} from "react";
import API from "../services/api";

function MovieSection() {
  const [movies,setMovies]=useState([]);

  useEffect(()=>{
    const fetchMovies=async()=>{
      try{
        const response=await API.get("/movies");
        setMovies(response.data);
      }catch(error){
        console.log("Error fetching movies",error);
      }
    };
    fetchMovies();
  },[]);

  return (
    <div className="movie-section">
      <h2>Now Showing</h2>
      <div className="movie-grid">
        {movies.slice(0, 10).map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie._id}
            title={movie.title}
            image={movie.posterUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieSection;
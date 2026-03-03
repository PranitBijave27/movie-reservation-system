import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api.js";
import "../styles/movieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await API.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div style={{ padding: "80px" }}>Loading...</div>;

  return (
    <div className="details-container">
      <div className="details-left">
        <img src={movie.posterUrl} alt={movie.title} />
      </div>

      <div className="details-right">
        <h1>{movie.title}</h1>

        <p className="details-description">
          {movie.description}
        </p>

        <div className="details-meta">
          <p><strong>Duration:</strong> {movie.duration} mins</p>
          <p><strong>Language:</strong> {movie.language}</p>
          <p><strong>Genre:</strong> {movie.genre?.join(", ")}</p>
        </div>

        <button className="details-book-btn">
          Select Show & Seats
        </button>
      </div>
    </div>
  );
}

export default MovieDetails;
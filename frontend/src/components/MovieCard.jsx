import "../styles/movieCard.css";
import { useNavigate } from "react-router-dom";

function MovieCard({id, title, image }) {
   const navigate = useNavigate();
    return (
    <div className="movie-card">
      <img src={image} alt={title} className="movie-img" />

      <div className="movie-info">
        <h3>{title}</h3>

        <button
          className="book-btn"
          onClick={() => navigate(`/movies/${id}`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
import "../styles/hero.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-overlay">
        <h1 className="hero-title">Experience Movies Like Never Before</h1>
        <p className="hero-subtitle">
          Book tickets. Choose seats. Enjoy the show.
        </p>
        <button className="hero-btn">Explore Movies</button>
      </div>
    </div>
  );
}

export default Hero;
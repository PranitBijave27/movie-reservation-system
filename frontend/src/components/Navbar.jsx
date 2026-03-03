import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">Premiere Hub</h2>
      </div>

      <div className="navbar-right">
        <button className="nav-btn">Movies</button>
        <button className="nav-btn">My Bookings</button>
        <button className="nav-btn login-btn">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;
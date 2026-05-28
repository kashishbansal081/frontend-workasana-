import { Link } from "react-router-dom";
import "../../App.css";

export default function Navbar() {
  return (
    <div className="sidebar">
      <Link className="logo mt-2 ms-2" to="/">
        workasana
      </Link>

      <ul className="menu">
        <li>
          <Link className="active" to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/projects">Project</Link>
        </li>
        <li>
          <Link to="/teams">Team</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
        <li>
          <Link to="/settings">Setting</Link>
        </li>
      </ul>
    </div>
  );
}
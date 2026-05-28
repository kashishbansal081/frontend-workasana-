import { Link } from "react-router-dom";
import "../../App.css";

export default function SideBar() {
  return (
    <div className="sidebar">
      <Link className="logo mt-2 ms-2" to="/">
        workasana
      </Link>

      <ul className="menu">
        <li>
          <Link to="/">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/settings">Setting</Link>
        </li>
      </ul>
    </div>
  );
}

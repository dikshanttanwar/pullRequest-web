import { useDispatch, useSelector } from "react-redux";
import appStore from "../utils/appStore";
import { deleteUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  let dispatch = useDispatch(appStore);
  let loggedInUser = useSelector((appStore) => appStore.user);
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(deleteUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to={"/feed"} className="btn btn-ghost text-xl">
          PullRequest 💘
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <p>{loggedInUser && loggedInUser.firstName}</p>

        <div className="dropdown dropdown-end px-5">
          {loggedInUser && (
            <>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={
                      loggedInUser.photoURL ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>

              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/profile"} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;

import { useDispatch, useSelector } from "react-redux";
import { clearFeed } from "../utils/feedSlice";
import { deleteUser } from "../utils/userSlice";
import { removePending } from "../utils/pendingSlice";
import { addConnections } from "../utils/connectionSlice";
import { addRequest } from "../utils/requestSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.user);
  // Accessing requests to show a notification count
  const requests = useSelector((store) => store.requests);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

      // Clear ALL slices
      dispatch(deleteUser()); // Clears user metadata
      dispatch(clearFeed()); // Clears user metadata
      dispatch(addConnections(null)); // Clears the network list
      dispatch(removePending()); // Clears user metadata
      dispatch(addRequest(null)); // Clears incoming requests
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="left-0 right-0 z-[100] bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d] h-16 flex items-center px-4 md:px-8">
      <div className="flex-1 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-xs">PR</span>
          </div>
          <span className="text-white font-black tracking-tighter text-xl italic">
            PullRequest<span className="text-indigo-500">.io</span>
          </span>
        </Link>

        {loggedInUser && (
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                isActive("/")
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-gray-400 hover:text-white hover:bg-[#1c2128]"
              }`}
            >
              &gt; Discover
            </Link>
            <Link
              to="/connections"
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                isActive("/connections")
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-gray-400 hover:text-white hover:bg-[#1c2128]"
              }`}
            >
              &gt; Network
            </Link>
            {/* NEW: Requests Link with Dynamic Badge */}
            <Link
              to="/requests"
              className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                isActive("/requests")
                  ? "text-indigo-400 bg-indigo-500/10"
                  : "text-gray-400 hover:text-white hover:bg-[#1c2128]"
              }`}
            >
              &gt; Requests
              {requests?.length > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {loggedInUser ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Authenticated as
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                {loggedInUser.firstName}
              </p>
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="w-10 h-10 rounded-full border-2 border-[#30363d] hover:border-indigo-500 transition-colors overflow-hidden shadow-xl flex justify-center items-center"
              >
                {loggedInUser.photoURL && (
                  <img
                    src={loggedInUser.photoURL}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                )}
                {!loggedInUser.photoURL && (
                  <p>{loggedInUser.firstName[0].toUpperCase()}</p>
                )}
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content mt-4 z-[100] menu p-2 shadow-2xl bg-[#161b22] border border-[#30363d] rounded-xl w-52 font-mono text-xs"
              >
                <div className="px-3 py-2 border-b border-[#30363d] mb-2">
                  <p className="text-gray-500 truncate">{loggedInUser.email}</p>
                </div>
                <li>
                  <Link
                    to="/profile"
                    className="flex justify-between py-2 text-gray-300 hover:text-white hover:bg-indigo-500/10 active:bg-indigo-500"
                  >
                    <span>view_profile()</span>
                    <span className="text-[9px] bg-[#30363d] px-1 rounded text-white">
                      SHIFT+P
                    </span>
                  </Link>
                </li>
                {/* Mobile-only links for accessibility */}
                <li className="md:hidden">
                  <Link to="/requests" className="py-2 text-gray-300">
                    view_requests()
                  </Link>
                </li>
                <li className="md:hidden">
                  <Link to="/connections" className="py-2 text-gray-300">
                    view_network()
                  </Link>
                </li>

                <div className="h-px bg-[#30363d] my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left"
                  >
                    system.exit()
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-ghost btn-sm text-xs font-bold uppercase tracking-widest text-indigo-400"
          >
            Login // Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

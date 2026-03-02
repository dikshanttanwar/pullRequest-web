import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((appStore) => appStore.connections);
  const [loading, setLoading] = useState(false);

  const getConnections = async () => {
    if (connections && connections.length > 0) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      // Ensure we target the correct data array from your API response
      dispatch(addConnections(res.data.connections || res.data));
    } catch (err) {
      console.error("Connection Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono">
        <div className="text-indigo-500 animate-pulse tracking-[0.4em]">
          LOADING_PEER_GRAPH...
        </div>
      </div>
    );

  if (!connections || connections.length === 0)
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono p-6">
        <div className="text-slate-700 text-6xl mb-4 opacity-20 italic">
          {"{ empty }"}
        </div>
        <p className="text-slate-500 mb-8 font-light italic">
          // Your collaborator network is currently offline.
        </p>
        <Link
          to="/feed"
          className="border border-indigo-500 text-indigo-400 px-10 py-3 rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-500 text-xs font-bold uppercase tracking-widest"
        >
          Initialize_Discovery
        </Link>
      </div>
    );

  console.log(connections.data);

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Minimalist Header */}
        <div className="flex items-center justify-between mb-12 border-l-4 border-indigo-500 pl-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              Nodes<span className="text-indigo-500">.active</span>
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-1">
              Network Strength: {connections.length} Stable Connections
            </p>
          </div>
        </div>

        {/* The List Container */}
        <div className="space-y-4">
          {connections.data.map((user) => (
            <div
              key={user._id}
              className="group relative flex items-center gap-6 bg-[#0f172a]/40 backdrop-blur-md border border-slate-800/50 p-4 rounded-2xl hover:bg-slate-800/30 hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
            >
              {/* Profile Image with Glow */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 group-hover:border-indigo-400 transition-colors shadow-2xl flex items-center justify-center">
                  {user.photoURL && <img src={user.photoURL} alt={user.firstName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />}
                  {!user.photoURL && <p>{user.firstName[0].toUpperCase()}</p>}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#020617] shadow-[0_0_10px_#6366f1]"></div>
              </div>

              {/* Identity & Metadata */}
              <div className="grow min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {user.firstName} {user.lastName}
                  </h2>
                  <span className="text-[9px] font-mono text-slate-600 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase">
                    Age: {user.age}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-mono italic line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  &gt; {user.about || "No metadata description available."}
                </p>
              </div>

              {/* Action Gutter */}
              <div className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
                <Link
                  to="/profile"
                  className="h-10 px-4 flex items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
                >
                  Open_Profile
                </Link>
              </div>

              {/* Subtle Gradient Line behind the row */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.4em]">
            // End of Directory
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connections;

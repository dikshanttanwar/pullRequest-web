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

  if (!connections || connections.data.length === 0)
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
              Network Strength: {connections.data.length} Stable Connections
            </p>
          </div>
        </div>

        {/* The List Container */}
        <div className="space-y-4">
          {connections.data.filter(Boolean).map((user) => (
            <div
              key={user._id}
              className="group bg-[#0d1117] border border-slate-800 p-5 rounded-2xl flex items-center gap-6 hover:border-indigo-500/40 transition-all shadow-xl"
            >
              {/* Profile Avatar */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700 shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.firstName}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                ) : (
                  <span>
                    {user.firstName ? user.firstName[0].toUpperCase() : "?"}
                  </span>
                )}
              </div>

              {/* Central Details */}
              <div className="flex-grow min-w-0">
                <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-3">
                  {user.firstName} {user.lastName}
                  <span className="text-[8px] font-mono text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800 uppercase">
                    Age: {user.age}
                  </span>
                </h3>
                <p className="text-slate-500 text-[9px] mt-1 font-mono uppercase tracking-widest truncate">
                  // {user.about || "Active Connection Node"}
                </p>
              </div>

              {/* Action Gutter */}
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-700/50 text-slate-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-sm">
                  Chat
                </button>
                <Link
                  to={`/profile/${user._id}`}
                  className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 text-center flex items-center"
                >
                  View Profile
                </Link>
              </div>
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

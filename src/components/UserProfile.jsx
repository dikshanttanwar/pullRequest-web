import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/viewUser/${userId}`, {
          withCredentials: true,
        });
        setTargetUser(res?.data?.user);
      } catch (err) {
        console.error("FAILED_TO_FETCH_USER", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#09090b] flex justify-center items-center">
        <div className="w-8 h-8 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );

  if (!targetUser)
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center">
        <div className="text-zinc-400 font-mono text-xs bg-zinc-900 px-6 py-4 rounded-xl border border-zinc-800 shadow-lg">
          Profile Context Not Found
        </div>
      </div>
    );

  const mainPhoto = targetUser.photoURL;
  const galleryImages =
    targetUser.images?.filter((img) => img.url !== mainPhoto) || [];

  return (
    <div className="bg-[#09090b] min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 text-zinc-200">
      {/* 🧭 NAVIGATION */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 w-fit px-3 py-1.5 hover:bg-zinc-800/50 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-all active:scale-95 group"
        >
          <span className="text-sm leading-none group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to feed
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* LEFT COLUMN: PRIMARY PHOTO & QUICK STATS (Sticky) */}
        <div className="w-full md:w-[280px] shrink-0 md:sticky md:top-24 space-y-4">
          {/* Aesthetic Image Card */}
          <div className="relative group rounded-3xl p-1 bg-gradient-to-b from-zinc-800/80 to-zinc-900/50 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <div className="relative aspect-[4/5] rounded-[1.3rem] overflow-hidden bg-zinc-950 flex items-center justify-center text-indigo-500 text-[8rem] font-black z-10 border border-zinc-800/50 shadow-inner">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt={`${targetUser.firstName}`}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <span className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  {targetUser.firstName
                    ? targetUser.firstName[0].toUpperCase()
                    : "?"}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none"></div>

              {/* Glassmorphism Title Plate */}
              <div className="absolute bottom-5 left-5 right-5">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-end gap-2 mb-1.5">
                  {targetUser.firstName}{" "}
                  <span className="text-zinc-400 font-medium">
                    {targetUser.lastName}
                  </span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    {targetUser.age} Y/O
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-center items-start shadow-sm">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Gender
              </span>
              <span className="text-zinc-200 text-xs font-semibold capitalize">
                {targetUser.gender || "—"}
              </span>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex flex-col justify-center items-start shadow-sm">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Status
              </span>
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT FLOW */}
        <div className="flex-1 flex flex-col gap-5 w-full">
          {/* ABOUT ME */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-zinc-700"></span> About
            </h2>
            <p className="text-zinc-300 leading-relaxed text-sm font-medium">
              {targetUser.about ||
                "This user prefers to let their code stand out instead of words."}
            </p>
          </section>

          {/* TECH STACK */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-zinc-700"></span> Tech Stack
            </h2>
            {targetUser.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {targetUser.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-zinc-950 border border-zinc-800/80 rounded-xl text-[11px] font-mono text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors shadow-sm cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 italic text-xs font-medium">
                No verified skills on this profile.
              </p>
            )}
          </section>

          {/* GALLERY BOX */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 lg:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-6 h-[1px] bg-zinc-700"></span> Media Asset
              </h2>
              <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-700/50 uppercase tracking-widest">
                {galleryImages.length} Frame(s)
              </span>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden bg-zinc-950 shadow-md group cursor-pointer border border-zinc-800/50 aspect-square"
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                      alt={`Gallery asset ${idx + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-950/50 rounded-2xl p-8 flex flex-col items-center justify-center border border-dashed border-zinc-800">
                <span className="text-2xl mb-3 opacity-30 grayscale">📸</span>
                <p className="text-zinc-500 text-xs font-medium">
                  No additional media assets deployed.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

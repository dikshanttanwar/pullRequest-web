import { useSelector } from "react-redux";
import { useState } from "react";
import EditProfileForm from "./EditProfileForm";

const Profile = () => {
  const user = useSelector((appStore) => appStore.user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("README.md");

  if (!user) return null;
  const skills = user?.skills || ["React.js", "Node.js", "TailwindCSS"];
  const gallery =
    user?.images?.filter((img) => img.url !== user.photoURL) || [];

  return (
    <div className="min-h-screen bg-[#08090a] text-[#d1d5db] font-mono pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto border border-[#30363d] rounded-lg overflow-hidden shadow-2xl bg-[#0d1117] flex flex-col h-[750px] animate-fadeIn">
        {/* IDE Top Bar */}
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between text-[11px] text-slate-500 select-none shrink-0">
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              File
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Edit
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              View
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Terminal
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Help
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-[9px]">
              devTinder // Workspace
            </span>
            <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold">
              V2.1-STABLE
            </span>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 bg-[#0d1117] border-r border-[#30363d] flex-col shrink-0 overflow-y-auto">
            <div className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest flex justify-between select-none border-b border-[#30363d]/50 bg-[#161b22]/50">
              Explorer
              <span className="cursor-pointer hover:text-slate-300">...</span>
            </div>
            <div className="flex-grow py-2">
              <div className="px-4 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
                v PORTFOLIO
              </div>
              <div
                onClick={() => {
                  setIsEditing(false);
                  setActiveTab("README.md");
                }}
                className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-colors text-xs select-none ${!isEditing && activeTab === "README.md" ? "bg-[#21262d] text-white border-l-2 border-indigo-500" : "hover:bg-[#161b22] text-slate-400 border-l-2 border-transparent"}`}
              >
                <span className="text-blue-400">📝</span> README.md
              </div>
              <div
                onClick={() => {
                  setIsEditing(false);
                  setActiveTab("package.json");
                }}
                className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-colors text-xs select-none ${!isEditing && activeTab === "package.json" ? "bg-[#21262d] text-white border-l-2 border-indigo-500" : "hover:bg-[#161b22] text-slate-400 border-l-2 border-transparent"}`}
              >
                <span className="text-yellow-400">📦</span> package.json
              </div>
              <div
                onClick={() => {
                  setIsEditing(false);
                  setActiveTab("assets");
                }}
                className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-colors text-xs select-none ${!isEditing && activeTab === "assets" ? "bg-[#21262d] text-white border-l-2 border-indigo-500" : "hover:bg-[#161b22] text-slate-400 border-l-2 border-transparent"}`}
              >
                <span className="text-emerald-400">📁</span> assets/
              </div>

              <div className="px-4 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 select-none">
                v CONFIGURATION
              </div>
              <div
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-3 px-6 py-2 cursor-pointer transition-colors text-xs select-none group ${isEditing ? "bg-[#21262d] text-white border-l-2 border-orange-500" : "hover:bg-[#161b22] text-slate-400 border-l-2 border-transparent"}`}
              >
                <span className="text-orange-400 group-hover:animate-pulse">
                  ⚙️
                </span>{" "}
                user.config.json
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-grow flex flex-col bg-[#0d1117] h-full overflow-hidden w-full">
            {isEditing ? (
              <EditProfileForm
                user={user}
                onComplete={() => {
                  setIsEditing(false);
                  setActiveTab("README.md");
                }}
              />
            ) : (
              <div className="flex flex-col h-full animate-fadeIn relative w-full">
                {/* Tab Bar */}
                <div className="flex bg-[#161b22] border-b border-[#30363d] overflow-x-auto custom-scrollbar shrink-0">
                  <div className="px-5 py-2.5 bg-[#0d1117] border-t-2 border-indigo-500 text-xs flex items-center justify-between gap-6 min-w-max border-r border-[#30363d]">
                    <span className="flex items-center gap-2 select-none">
                      {activeTab === "README.md" && (
                        <span className="text-blue-400">📝 README.md</span>
                      )}
                      {activeTab === "package.json" && (
                        <span className="text-yellow-400">📦 package.json</span>
                      )}
                      {activeTab === "assets" && (
                        <span className="text-emerald-400">📁 assets/</span>
                      )}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-slate-500 hover:text-orange-400 transition-colors bg-white/5 px-2 py-0.5 rounded cursor-pointer"
                      title="Edit Mode"
                    >
                      <span className="text-[10px] uppercase font-bold tracking-widest">
                        Edit
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex-grow flex overflow-hidden">
                  {/* Line Numbers */}
                  <div className="hidden sm:block text-slate-700 text-xs text-right select-none leading-8 opacity-40 p-6 pr-4 border-r border-[#30363d]/50 overflow-hidden shrink-0">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Previews */}
                  <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                    {activeTab === "README.md" && (
                      <div className="max-w-3xl space-y-6 animate-fadeIn">
                        <div className="pb-6 border-b border-[#30363d]/50 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                          <div className="w-32 h-32 rounded-full overflow-hidden border border-[#30363d] shrink-0 p-1 bg-[#161b22] shadow-2xl">
                            <img
                              src={
                                user.photoURL ||
                                "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                              }
                              className="w-full h-full object-cover rounded-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                              alt="avatar"
                            />
                          </div>
                          <div className="pt-2 text-center sm:text-left">
                            <h1 className="text-3xl font-black text-white tracking-tight">
                              {user.firstName} {user.lastName}
                              <span className="text-indigo-400 text-xl ml-2 font-normal opacity-70">
                                ({user.age})
                              </span>
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                              {user.gender || "Unknown"} | ONLINE
                            </div>
                            <p className="mt-4 text-emerald-400/80 font-mono bg-emerald-500/10 inline-block px-3 py-1.5 rounded text-[10px] border border-emerald-500/20 select-all">
                              ~ $ whoami
                            </p>
                          </div>
                        </div>

                        <div>
                          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-300 border-b border-[#30363d]/50 pb-2 mb-4">
                            <span className="text-indigo-400">##</span>{" "}
                            System_Biography
                          </h2>
                          <div className="bg-[#161b22]/50 p-4 rounded text-slate-400 text-sm leading-relaxed border border-[#30363d]/50 shadow-inner group">
                            <div className="flex text-[10px] text-slate-600 mb-2 uppercase font-bold justify-between">
                              <span>Markdown Rendered</span>
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                Preview
                              </span>
                            </div>
                            {user.about ||
                              "> No biography provided in README.md. Please initialize bio string."}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "package.json" && (
                      <div className="max-w-3xl space-y-2 text-sm font-mono animate-fadeIn">
                        <p className="text-slate-400">{"{"}</p>
                        <p className="pl-6 text-pink-400">
                          "name":{" "}
                          <span className="text-emerald-400">
                            "{user.firstName}-{user.lastName}"
                          </span>
                          ,
                        </p>
                        <p className="pl-6 text-pink-400">
                          "version":{" "}
                          <span className="text-emerald-400">"1.0.0"</span>,
                        </p>
                        <p className="pl-6 text-pink-400">
                          "description":{" "}
                          <span className="text-emerald-400">
                            "Core dependencies and stack."
                          </span>
                          ,
                        </p>
                        <p className="pl-6 text-pink-400">
                          "dependencies":{" "}
                          <span className="text-slate-400">{"{"}</span>
                        </p>
                        {skills.map((s, idx) => (
                          <p
                            key={idx}
                            className="pl-12 hover:bg-[#161b22] w-fit rounded transition-colors px-1 cursor-crosshair"
                          >
                            <span className="text-blue-400">"{s}"</span>:{" "}
                            <span className="text-emerald-400">"latest"</span>
                            {idx < skills.length - 1 ? (
                              <span className="text-slate-400">,</span>
                            ) : (
                              ""
                            )}
                          </p>
                        ))}
                        <p className="pl-6 text-slate-400">{"}"}</p>
                        <p className="text-slate-400">{"}"}</p>
                      </div>
                    )}

                    {activeTab === "assets" && (
                      <div className="max-w-3xl animate-fadeIn">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-6 select-none border-b border-[#30363d]/30 pb-3">
                          <span className="text-emerald-400">➜</span>
                          <span>
                            <span className="text-indigo-400">~/workspace</span>{" "}
                            / <span className="text-indigo-400">devTinder</span>{" "}
                            / public /{" "}
                            <span className="text-slate-200 font-bold border-b border-slate-500">
                              assets
                            </span>
                          </span>
                        </div>
                        {gallery.length === 0 ? (
                          <div className="text-slate-500 italic text-sm border border-dashed border-[#30363d] p-10 text-center bg-[#161b22]/30 rounded flex flex-col items-center gap-3">
                            <span className="text-4xl opacity-30">📁</span>
                            No media files found in ./assets directory. Edit
                            config to pull new branches.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {gallery.map((img, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-[3/4] group border border-[#30363d] bg-black rounded overflow-hidden shadow-2xl p-1 hover:border-indigo-500/50 transition-colors"
                              >
                                <img
                                  src={img.url}
                                  className="w-full h-full object-cover rounded-sm group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                  alt={`Asset ${idx}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                                  <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-tighter truncate w-full">
                                    img_asset_{idx + 1}.webp
                                  </span>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-pink-400 text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  READ-ONLY
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* IDE Footer Bar */}
        <div className="bg-indigo-600 text-white px-4 py-1 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest shrink-0">
          <div className="flex gap-4 items-center">
            <span className="hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition">
              UTF-8
            </span>
            <span className="hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition">
              Remote Sync
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition">
              Prettier: ✓
            </span>
            <span className="flex items-center gap-1 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition">
              <span className="text-[14px]">⑂</span> master*
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

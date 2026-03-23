import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfileForm = ({ user, onComplete }) => {
  const avatarInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const dispatch = useDispatch();

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.photoURL || "");
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    if (user.images && Array.isArray(user.images)) {
      setGallery(
        user.images
          .filter((img) => img.url !== user.photoURL)
          .map((img, i) => ({
            id: i,
            url: img.url,
            file: null,
            isPrimary: img.isPrimary,
          })),
      );
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:"))
        URL.revokeObjectURL(avatarPreview);
      gallery.forEach((g) => {
        if (g.url && g.url.startsWith("blob:")) URL.revokeObjectURL(g.url);
      });
    };
  }, [avatarPreview, gallery]);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    about: user.about || "",
    gender: user.gender || "",
    skills: user.skills || [],
  });

  useEffect(() => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age || "",
      about: user.about || "",
      gender: user.gender || "",
      skills: user.skills || [],
    });
    setAvatarPreview(user.photoURL || "");
    setSelectedAvatar(null);
  }, [user]);

  const [skillInput, setSkillInput] = useState("");
  const [systemLogs, setSystemLogs] = useState([
    "[SYSTEM] editor.config loaded.",
    "[SYSTEM] Ready for modifications.",
  ]);
  const [loading, setLoading] = useState(false);

  const logAction = (msg, type = "INFO") => {
    setSystemLogs((prev) => [`[${type}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "about" && value.length > 300) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        logAction(
          "ERR_FILE_TOO_LARGE: Max 5MB allowed for primary.img",
          "ERROR",
        );
        return;
      }
      setSelectedAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      logAction(`Loaded primary.img -> ${file.name}`);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (gallery.length + files.length > 5) {
      logAction("ERR_LIMIT_EXCEEDED: Gallery buffer full (Max 5).", "ERROR");
      return;
    }
    const newGalleryItems = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue;
      newGalleryItems.push({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file: file,
        isPrimary: false,
      });
      logAction(`Loaded gallery asset -> ${file.name}`);
    }
    setGallery([...gallery, ...newGalleryItems]);
    e.target.value = null;
  };

  const removeGalleryImage = (idToRemove) => {
    setGallery(gallery.filter((g) => g.id !== idToRemove));
    logAction("Removed asset from gallery.buffer", "WARN");
  };

  const handleAddSkill = (e) => {
    if ((e.key === "Enter" || e.type === "click") && skillInput.trim()) {
      e.preventDefault();
      if (formData.skills.length >= 10) {
        logAction("ERR_STACK_OVERFLOW: Max 10 dependencies allowed.", "ERROR");
        return;
      }
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()],
        });
        logAction(`Installed dependency: ${skillInput.trim()}`);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
    logAction(`Uninstalled dependency: ${skillToRemove}`, "WARN");
  };

  const isDirty = () => {
    const hasFile = selectedAvatar !== null;
    const hasGalleryAdditions = gallery.some((g) => g.file !== null);

    const originalGalleryUrls = (user.images || [])
      .filter((img) => img.url !== user.photoURL)
      .map((img) => img.url);
    const newGalleryUrls = gallery.filter((g) => !g.file).map((g) => g.url);
    const galleryChanged =
      JSON.stringify(originalGalleryUrls) !== JSON.stringify(newGalleryUrls);

    const hasTextChanges =
      JSON.stringify(formData) !==
      JSON.stringify({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        about: user.about || "",
        gender: user.gender || "",
        skills: user.skills || [],
      });
    return hasFile || hasGalleryAdditions || galleryChanged || hasTextChanges;
  };

  const saveProfile = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.gender
    ) {
      logAction(
        "ERR_MISSING_REQ_ARGS: Name, Age, and Gender are required fields.",
        "ERROR",
      );
      return;
    }

    if (!isDirty()) {
      logAction("Working tree is clean. Nothing to commit.", "WARN");
      return;
    }

    setLoading(true);
    logAction("git commit -m 'Update user profile'", "INFO");
    logAction("git push origin master", "INFO");

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      data.append("about", formData.about);
      data.append("skills", JSON.stringify(formData.skills));

      if (selectedAvatar) data.append("photoURL", selectedAvatar);
      else data.append("photoURL", user.photoURL || "");

      const manifest = gallery.map((item) => {
        if (item.file) {
          data.append("galleryFiles", item.file);
          return { url: null, isPrimary: item.isPrimary || false };
        }
        return { url: item.url, isPrimary: item.isPrimary || false };
      });
      data.append("images", JSON.stringify(manifest));

      const res = await axios.patch(BASE_URL + "/profile/edit", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addUser(res?.data?.user));
      logAction("DEPLOYMENT_SUCCESSFUL: Remote synced.", "SUCCESS");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "SYS_FAULT";
      logAction(`FATAL_ERROR: ${msg.toUpperCase()}`, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] font-mono animate-fadeIn relative overflow-hidden w-full">
      {/* Tab Bar */}
      <div className="min-h-fit flex bg-[#161b22] border-b border-[#30363d] overflow-x-auto custom-scrollbar">
        <div className="px-5 py-2.5 bg-[#0d1117] border-t-2 border-indigo-500 text-xs flex items-center justify-between gap-4 group min-w-max">
          <span className="flex items-center gap-2">
            <span className="text-yellow-400">⚡</span> user.config.json
          </span>
          <button
            onClick={onComplete}
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-grow flex p-6 overflow-y-auto custom-scrollbar gap-4 relative">
        {/* Line Numbers */}
        <div className="hidden sm:block text-slate-700 text-xs text-right select-none leading-8 opacity-40 pr-4 border-r border-[#30363d]/50">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Form Area */}
        <div className="flex-grow max-w-3xl space-y-6">
          <div className="text-slate-500/70 text-xs italic">
            // EDIT_MODE_ACTIVE: Configure primary user.config.json object
          </div>

          <div className="space-y-4">
            {/* Primary Avatar config */}
            <div className="group">
              <span className="text-pink-400 text-xs tracking-wider">
                "primary_avatar":
              </span>
              <div className="mt-2 ml-4 flex items-center gap-4">
                <div
                  onClick={() => avatarInputRef.current.click()}
                  className="w-20 h-20 rounded-md overflow-hidden border border-[#30363d] cursor-pointer hover:border-indigo-500 transition-all bg-[#08090a] flex items-center justify-center relative"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  ) : (
                    <span className="text-xs text-slate-500 font-bold uppercase">
                      Upload
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="font-bold text-[8px] text-white">
                      CHANGE
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 space-y-1">
                  <p>{"{"}</p>
                  <p className="ml-4">
                    "type":{" "}
                    <span className="text-emerald-400">"Buffer/Image"</span>,
                  </p>
                  <p className="ml-4">
                    "maxSize": <span className="text-orange-400">"5MB"</span>
                  </p>
                  <p>{"},"}</p>
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Standard JSON fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 ml-4 pl-4 border-l border-[#30363d]/50">
              <div className="flex flex-col gap-1">
                <span className="text-pink-400 text-xs">"first_name":</span>
                <div className="flex items-center text-sm font-bold tracking-tight">
                  <span className="text-emerald-400">"</span>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-transparent border-b border-slate-700 focus:border-indigo-500 text-emerald-400 outline-none p-0.5 w-full"
                  />
                  <span className="text-emerald-400">",</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-pink-400 text-xs">"last_name":</span>
                <div className="flex items-center text-sm font-bold tracking-tight">
                  <span className="text-emerald-400">"</span>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-transparent border-b border-slate-700 focus:border-indigo-500 text-emerald-400 outline-none p-0.5 w-full"
                  />
                  <span className="text-emerald-400">",</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-pink-400 text-xs">"age":</span>
                <div className="flex items-center text-sm font-bold tracking-tight">
                  <input
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="bg-transparent border-b border-slate-700 focus:border-indigo-500 text-orange-400 outline-none p-0.5 w-16 text-center"
                  />
                  <span className="text-slate-400">,</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-pink-400 text-xs">"gender":</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="bg-[#08090a] border border-slate-700 focus:border-indigo-500 text-emerald-400 outline-none p-1 text-xs appearance-none w-max"
                >
                  <option value="">"SELECT"</option>
                  <option value="male">"male"</option>
                  <option value="female">"female"</option>
                  <option value="other">"other"</option>
                </select>
              </div>
            </div>

            {/* Readme / Bio inside JSON */}
            <div className="ml-4 pl-4 border-l border-[#30363d]/50">
              <span className="text-pink-400 text-xs">"bio_markdown":</span>
              <div className="mt-1 relative">
                <span className="text-emerald-400 font-bold">`</span>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="2"
                  className="w-full bg-[#08090a] border border-[#30363d] focus:border-indigo-500 outline-none p-3 text-xs text-blue-300 resize-none mt-1 shadow-inner rounded"
                />
                <span className="text-emerald-400 font-bold block">`,</span>
              </div>
            </div>

            {/* Arrays: Dependencies */}
            <div className="ml-4 pl-4 border-l border-[#30363d]/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-pink-400 text-xs">"dependencies": [</span>
                <span className="text-[10px] text-slate-500 italic max-w-max border border-[#30363d] px-2 py-0.5 rounded">
                  LIMIT: 10
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pl-4 py-2 border-l border-dashed border-slate-800">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-2 py-1 flex items-center gap-1 group"
                  >
                    "{skill}"
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <div className="flex items-center text-xs">
                  <span className="text-emerald-400 font-bold group-focus-within:text-indigo-400">
                    "
                  </span>
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="add_new_pkg"
                    className="bg-transparent border-b border-transparent focus:border-indigo-500 outline-none text-emerald-400 w-24 px-1 placeholder:text-slate-600 placeholder:italic transition-colors"
                  />
                  <span className="text-emerald-400 font-bold mr-2 group-focus-within:text-indigo-400">
                    "
                  </span>
                  <button
                    onClick={handleAddSkill}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 uppercase font-black bg-[#161b22] px-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <span className="text-pink-400 text-xs block mt-1">],</span>
            </div>

            {/* Arrays: Gallery Assets */}
            <div className="ml-4 pl-4 border-l border-[#30363d]/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-pink-400 text-xs">
                  "workspace_assets": [
                </span>
                <button
                  onClick={() => galleryInputRef.current.click()}
                  disabled={gallery.length >= 5}
                  className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase hover:bg-emerald-500/20 disabled:opacity-50 transition"
                >
                  + Upload ({gallery.length}/5)
                </button>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-4 py-2 border-l border-dashed border-slate-800">
                {gallery.map((gItem) => (
                  <div
                    key={gItem.id}
                    className="relative aspect-[3/4] bg-[#08090a] border border-[#30363d] rounded-sm group overflow-hidden"
                  >
                    <img
                      src={gItem.url}
                      alt="GalleryAsset"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <button
                      onClick={() => removeGalleryImage(gItem.id)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white w-5 h-5 flex items-center justify-center rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-slate-400 font-mono px-1 truncate">
                      asset_{gItem.id.toString().slice(-4)}.jpg
                    </div>
                  </div>
                ))}
                {[...Array(Math.max(0, 5 - gallery.length))].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] border border-[#30363d] border-dashed rounded-sm bg-[#08090a]/50 flex items-center justify-center text-slate-700 text-[10px] font-black pointer-events-none"
                  >
                    {/* NULL */}
                  </div>
                ))}
              </div>
              <span className="text-pink-400 text-xs block mt-1">]</span>
            </div>
          </div>

          <div className="pt-6 text-right">
            <button
              onClick={saveProfile}
              disabled={loading}
              className={`px-6 py-2 border text-xs font-black uppercase tracking-widest ${loading ? "bg-[#161b22] text-slate-500 border-[#30363d] cursor-wait" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/50 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"}`}
            >
              {loading ? "Compiling Module..." : "./save_profile.sh"}
            </button>
          </div>
          <div className="pb-10"></div>
        </div>
      </div>

      {/* Terminal View specific for Edit Form */}
      <div className="h-32 bg-[#08090a] border-t border-[#30363d] p-3 overflow-y-auto shrink-0 z-10 relative">
        <div className="text-[9px] font-bold text-slate-600 mb-2 border-b border-[#30363d] pb-1 uppercase tracking-tighter flex gap-4">
          <span className="text-slate-300">Terminal</span>
          <span className="hover:text-slate-300 cursor-pointer">Problems</span>
          <span className="hover:text-slate-300 cursor-pointer">Output</span>
          <span className="hover:text-slate-300 cursor-pointer">
            Debug Console
          </span>
        </div>
        {systemLogs.map((log, i) => {
          let color = "text-slate-500";
          if (log.includes("[ERROR]") || log.includes("FATAL_ERROR"))
            color = "text-red-500 font-bold";
          else if (log.includes("[SUCCESS]")) color = "text-emerald-400";
          else if (log.includes("[INFO]")) color = "text-blue-400";
          else if (log.includes("[WARN]")) color = "text-yellow-500";
          else if (i === 0) color = "text-indigo-400";

          return (
            <div
              key={i}
              className={`text-[10px] leading-relaxed font-mono ${color}`}
            >
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditProfileForm;

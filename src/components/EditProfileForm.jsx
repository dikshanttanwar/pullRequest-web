import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion } from "framer-motion";

const EditProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    photoURL: user.photoURL || "",
    about: user.about || "",
    gender: user.gender || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const isUnchanged = Object.keys(formData).every(
        (key) => formData[key] === user[key],
      );
      if (isUnchanged) throw new Error("No changes detected.");

      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });

      dispatch(addUser(res?.data?.user));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4">
          <div className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded text-xs font-bold border border-indigo-500/30">
            CONFIG_EDIT
          </div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            {formData.firstName.toLowerCase() || "user"}.json
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: The Code Editor Form */}
          <div className="lg:col-span-7 bg-[#0b0f1a] rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#080c14] border-r border-slate-800 flex flex-col items-center py-8 text-slate-700 text-[10px] select-none">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="leading-8">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="pl-14 pr-8 py-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                    "first_name":
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-3 rounded text-sm text-orange-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                    "last_name":
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-3 rounded text-sm text-orange-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                    "age":
                  </label>
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    type="number"
                    className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-3 rounded text-sm text-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                    "gender":
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-3 rounded text-sm text-emerald-400 cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                  "avatar_url":
                </label>
                <input
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-3 rounded text-sm text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                  "bio_content":
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-[#030712] border border-slate-800 focus:border-indigo-500 outline-none px-4 py-4 rounded text-sm resize-none text-orange-200"
                />
              </div>

              <div className="min-h-[48px]">
                {error && (
                  <div className="text-red-500 text-xs animate-pulse font-bold">
                    [SYSTEM_ERROR] // {error}
                  </div>
                )}
                {success && (
                  <div className="text-emerald-500 text-xs font-bold">
                    [SUCCESS] // Synchronized with master branch
                  </div>
                )}
              </div>

              <button
                onClick={saveProfile}
                disabled={loading}
                className={`w-full py-4 rounded font-black text-xs uppercase tracking-[0.3em] transition-all border ${loading ? "bg-slate-900 border-slate-800 text-slate-700" : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"}`}
              >
                {loading ? "PUSHING_CHANGES..." : "SAVE_TO_BRANCH"}
              </button>
            </div>
          </div>

          {/* RIGHT: The Viewport Preview (FIXED VISIBILITY) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-28  flex flex-col items-center">
              <div className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                live_preview_render
              </div>

              {/* Force a specific height container to prevent 0px collapse */}
              <div className="w-full h-[500px] flex justify-center items-start">
                {/* <motion.div
                  drag={false}
                  className="w-full h-full flex justify-center transform scale-95 xl:scale-100 transition-transform duration-500"
                >
                  <UserCard user={formData} />
                </motion.div>
                 */}

                {/* <div className="w-full h-full flex justify-center transform scale-95 xl:scale-100 transition-transform duration-500">
                  <UserCard user={formData} />
                </div> */}

                <div className="w-full h-full flex justify-center transform scale-95 xl:scale-100 transition-transform duration-500 pointer-events-none">
                  <UserCard user={formData} />
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-900/30 border border-slate-800 rounded-lg text-[10px] text-slate-500 max-w-[340px]">
                <p>
                  // Interactive elements (drag/swipe) are disabled in
                  configuration mode to ensure stable metadata editing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;

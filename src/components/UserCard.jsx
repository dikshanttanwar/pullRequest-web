import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const UserCard = ({ user, onSwipe, custom }) => {
  const { firstName, lastName, photoURL, about, age, gender } = user;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // 🛠️ UPDATE: Variants ensure the card flies based on the 'custom' direction prop
  const variants = {
    enter: { scale: 0.9, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: (direction) => ({
      x: direction < 0 ? -1000 : 1000, // Explicitly -1000 if left, 1000 if right
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      whileDrag={{ cursor: "grabbing" }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 120) onSwipe("interested", user._id);
        else if (info.offset.x < -120) onSwipe("ignored", user._id);
      }}
      // 🛠️ UPDATE: Link motion to variants
      custom={custom}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 cursor-grab"
    >
      <div className="w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-[#333] font-mono flex flex-col">
        <div className="bg-[#252526] px-4 py-2 border-b border-[#333] flex items-center justify-between text-[#858585] text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs font-bold">MD</span>
            <span>{firstName.toLowerCase()}.profile</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
          </div>
        </div>

        <div className="relative h-2/3 w-full">
          <img
            src={photoURL || "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"}
            alt={firstName}
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
          <h2 className="absolute bottom-4 left-4 text-2xl font-black text-white">
            {firstName}{" "}
            <span className="text-blue-500 font-light">{lastName}</span>
          </h2>
        </div>

        <div className="p-5 flex-grow space-y-3 text-xs">
          <p>
            <span className="text-purple-400">const</span>{" "}
            <span className="text-yellow-200">bio</span> ={" "}
            <span className="text-orange-300">"{about}"</span>
          </p>
          <p>
            <span className="text-purple-400">const</span>{" "}
            <span className="text-yellow-200">tags</span> = [
            <span className="text-blue-400">
              "{gender?.charAt(0).toUpperCase() + gender?.slice(1)}"
            </span>
            , <span className="text-purple-400">"AGE_{age}"</span>]
          </p>
        </div>

        <div className="bg-[#007acc] px-4 py-1 text-[9px] text-white uppercase tracking-widest flex justify-between">
          <span>{firstName}_session.v1</span>
          <span>UTF-8</span>
        </div>
      </div>

      <motion.div
        style={{ opacity: useTransform(x, [0, 80], [0, 1]) }}
        className="absolute top-20 left-10 border-4 border-green-500 text-green-500 font-black px-4 py-1 rounded uppercase rotate-[-15deg] pointer-events-none z-50 bg-[#1e1e1e]"
      >
        Approve
      </motion.div>
      <motion.div
        style={{ opacity: useTransform(x, [0, -80], [0, 1]) }}
        className="absolute top-20 right-10 border-4 border-red-500 text-red-500 font-black px-4 py-1 rounded uppercase rotate-[15deg] pointer-events-none z-50 bg-[#1e1e1e]"
      >
        Reject
      </motion.div>
    </motion.div>
  );
};

export default UserCard;

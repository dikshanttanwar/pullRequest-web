import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { AnimatePresence } from "framer-motion";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  //rack swipe direction for the exit animation
  const [swipeDir, setSwipeDir] = useState(0);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.allUsers));
    } catch (err) {
      console.error("Feed Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  //Handler to set direction before dispatching remove
  const handleRemove = async (direction, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + `/request/${direction}/${userId}`,
        {},
        { withCredentials: true },
      );
      setSwipeDir(direction === "interested" ? 1 : -1);
      setTimeout(() => {
        dispatch(removeFeed(userId));
      }, 10);
    } catch (err) {
      console.error("Feed Update Error:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-blue-400">
        <span className="animate-pulse tracking-[0.3em]">
          REHYDRATING_STACK...
        </span>
      </div>
    );

  if (!feed || feed.length === 0)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono">
        <p className="text-[#858585] mb-6">// End of stack. No more PRs.</p>
        <button
          onClick={getFeed}
          className="bg-[#d4d4d4] text-[#0a0a0a] px-8 py-3 font-bold hover:bg-white transition-all text-xs uppercase"
        >
          RESCAN_NETWORK
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden p-4">
      <div className="fixed top-24 text-center z-10">
        <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
          dev_feed.log
        </h1>
        <p className="text-[10px] text-blue-500/50 uppercase tracking-[0.2em]">
          {feed.length} Active Sessions
        </p>
      </div>

      <div className="relative w-full max-w-[380px] h-[580px]">
        <AnimatePresence custom={swipeDir}>
          {feed.length > 0 && (
            <UserCard
              key={feed[0]._id}
              user={feed[0]}
              onSwipe={handleRemove}
              custom={swipeDir}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;

import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { addPending } from "../utils/pendingSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requestReceived);
  const pending = useSelector((store) => store.requestPending);

  const [activeTab, setActiveTab] = useState("incoming");
  const [loading, setLoading] = useState(false);

  const fetchReceivedRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.connectionRequests || []));
      console.log(res?.data);
    } catch (err) {
      console.error("Received Fetch Error:", err);
    }
  };

  const fetchPendingRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/sent`, {
        withCredentials: true,
      });
      dispatch(addPending(res?.data?.connectionRequests || []));
      console.log(res?.data);
    } catch (err) {
      console.error("Sent Fetch Error:", err);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Review Error:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchReceivedRequest(), fetchPendingRequest()]).finally(() =>
      setLoading(false),
    );
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-indigo-500 uppercase tracking-[0.3em]">
        SYNCING_REQUEST_BUFFER...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 px-4 md:px-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-1 mb-10 bg-[#0b0f1a] p-1 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "incoming" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"}`}
          >
            Review_Required ({requests?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "pending" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"}`}
          >
            Sent_Requests ({pending?.length || 0})
          </button>
        </div>

        {/* Dynamic List Rendering */}
        <div className="space-y-4">
          {activeTab === "incoming" ? (
            requests?.length > 0 ? (
              requests.map((req) => (
                <div
                  key={req._id}
                  className="group bg-[#0d1117] border border-slate-800 p-5 rounded-2xl flex items-center gap-6 hover:border-indigo-500/40 transition-all shadow-xl"
                >
                  {/* Note: Mapping to req.fromUserID based on your response */}
                  <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
                    {req.fromUserID.firstName[0]}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white font-bold text-sm tracking-tight">
                      {req.fromUserID.firstName} {req.fromUserID.lastName}
                    </h3>
                    <p className="text-slate-500 text-[9px] mt-1 uppercase tracking-widest">
                      Inbound // Status: {req.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => reviewRequest("rejected", req._id)}
                      className="px-4 py-2 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => reviewRequest("accepted", req._id)}
                      className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-xs italic text-center py-10">
                // No incoming requests found.
              </p>
            )
          ) : pending?.length > 0 ? (
            pending.map((req) => (
              <div
                key={req._id}
                className="bg-[#0d1117]/50 border border-slate-800/50 p-5 rounded-2xl flex items-center gap-6 opacity-80"
              >
                {/* Note: Mapping to req.toUserID based on your response */}
                <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 font-bold border border-slate-800">
                  {req.toUserID.firstName[0]}
                </div>
                <div className="flex-grow">
                  <h3 className="text-slate-300 font-bold text-sm tracking-tight">
                    {req.toUserID.firstName} {req.toUserID.lastName}
                  </h3>
                  <p className="text-slate-600 text-[9px] mt-1 italic tracking-widest font-bold">
                    // AWAITING_RESPONSE_FROM_PEER
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500/50"></span>
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
                    Outbound
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-600 text-xs italic text-center py-10">
              // Outbox is empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;

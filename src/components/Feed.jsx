import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/feedSlice";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const loggedInUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Dimensions for full screen graph
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const graphRef = useRef();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);

  // Resize handler
  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escape key handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedNode(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Sync Feed array into Graph Nodes with Image Preloading
  useEffect(() => {
    if (!feed) return;

    // Central User Node
    const centerNode = {
      id: "center",
      user: loggedInUser,
      val: 8, // Appropriately sized center node
      color: "#6366f1", // indigo-500
      name: "Me",
      isCenter: true,
    };
    if (loggedInUser?.photoURL) {
      const img = new Image();
      img.src = loggedInUser.photoURL;
      centerNode.img = img;
    }

    // Feed users nodes
    const userNodes = feed.map((u) => {
      const node = {
        id: u._id,
        user: u,
        val: 5, // Perfect size to see avatars clearly
        color: "#334155", // slate-700
        name: u.firstName,
        isCenter: false,
      };
      if (u.photoURL) {
        const img = new Image();
        img.src = u.photoURL;
        node.img = img;
      }
      return node;
    });

    // Links from center to all nodes back
    const links = userNodes.map((node) => ({
      source: "center",
      target: node.id,
      distance: 180, // Generous orbit distance that still fits well on screen
    }));

    setGraphData({
      nodes: [centerNode, ...userNodes],
      links: links,
    });
  }, [feed, loggedInUser]);

  // Inject Anti-Gravity Repulsion physics so nodes never clash!
  useEffect(() => {
    if (graphRef.current) {
      // Powerful magnetic repulsion so nodes strictly orbit each other
      graphRef.current.d3Force("charge").strength(-20);

      // Auto-magically frame the camera to fit the physics universe perfectly
      setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.zoomToFit(1000, 150); // 800ms transition time, 120px padding
        }
      }, 500); // 500ms delay to let the physics simulation settle first
    }
  }, [graphData]);

  // Handle connection request
  const handleAction = async (direction, userId) => {
    setSelectedNode(null);
    try {
      await axios.post(
        BASE_URL + `/request/${direction}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeed(userId));
    } catch (err) {
      console.error("Action Error:", err);
    }
  };

  const handleNodeClick = useCallback((node) => {
    if (node.isCenter) return;
    setSelectedNode(node);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Ensures accurate mouse-layer hitboxes so dragging and clicking are perfectly separated
  const nodePointerAreaPaint = useCallback((node, color, ctx) => {
    const size = node.val;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI, false);
    ctx.fill();
  }, []);

  // Custom node painting to render Avatars identically
  const paintNode = useCallback(
    (node, ctx) => {
      const size = node.val;

      // Draw outer glow / circle highlighting
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 1, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.id === selectedNode?.id ? "#818cf8" : node.color; // highlight if selected
      ctx.fill();

      // Render Avatar or Initial
      if (node.img && node.img.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          node.img,
          node.x - size,
          node.y - size,
          size * 2,
          size * 2,
        );
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#0f172a"; // slate-900 inner
        ctx.fill();

        ctx.font = `${size * 0.8}px Inter`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.name[0], node.x, node.y);
      }

      // Text Label pushed further down to prevent clipping the circle
      ctx.font = `${2.5}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#94a3b8"; // slate-400
      ctx.fillText(node.name, node.x, node.y + size + 3);
    },
    [selectedNode],
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-indigo-500">
        <span className="animate-pulse tracking-[0.3em]">
          INITIALIZING_PHYSICS_ENGINE...
        </span>
      </div>
    );

  if (!feed || feed.length === 0)
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono">
        <div className="w-32 h-32 rounded-full border border-indigo-500/30 flex items-center justify-center animate-[ping_3s_ease-in-out_infinite]">
          <span className="text-xs text-indigo-500/50">SCANNING</span>
        </div>
        <p className="text-slate-500 mt-8 mb-4 uppercase tracking-[0.3em] text-xs">
          Zero objects detected in local space.
        </p>
        <button
          onClick={getFeed}
          className="border border-indigo-500/50 text-indigo-400 px-6 py-2 hover:bg-indigo-500 hover:text-white transition-all text-xs uppercase cursor-pointer"
        >
          REBOOT_RADAR
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
        <div className="flex justify-between items-start pt-20">
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">
              Node<span className="text-indigo-500">_Space</span>
            </h1>
            <p className="text-xs text-indigo-500/50 uppercase tracking-[0.3em] mt-2 font-mono">
              {feed.length} Entities in Local Cluster
            </p>
          </div>
          <div className="text-right font-mono text-slate-600 text-[9px] uppercase tracking-widest leading-relaxed hidden md:block">
            SYS.VER: 4.1.2
            <br />
            PHYSICS_ENGINE: ACTIVE
            <br />
            GRAVITY: 0.8g
          </div>
        </div>
        <div className="text-center pb-8 font-mono text-grey-700 text-[10px] uppercase tracking-[0.2em]">
          Click a node to inspect payload // Drag to manipulate physics
        </div>
      </div>

      {/* The Force Graph */}
      <div className="absolute inset-0 cursor-crosshair">
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeCanvasObject={paintNode}
          nodePointerAreaPaint={nodePointerAreaPaint}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          linkColor={() => "#1e293b"} // slate-800
          linkWidth={1}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleColor={() => "#6366f1"}
          backgroundColor="#020617"
          d3Force="charge" // Adjust physics
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.1}
          enableZoomInteraction={false}
          enablePanInteraction={false}
        />
      </div>

      {/* Selected Node Inspector Modal */}
      {selectedNode && !selectedNode.isCenter && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-[#0d1117]/80 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-6 shadow-2xl shadow-indigo-500/10">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"
          >
            ✖
          </button>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 mb-4 bg-slate-800">
              {selectedNode.user.photoURL ? (
                <img
                  src={selectedNode.user.photoURL}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-400">
                  {selectedNode.name[0]}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">
              {selectedNode.name} {selectedNode.user.lastName}
            </h2>
            <p className="text-xs text-indigo-400 font-mono mt-1">
              Age: {selectedNode.user.age} // {selectedNode.user.gender}
            </p>

            <p className="text-sm text-slate-400 mt-4 text-center line-clamp-3 italic">
              "{selectedNode.user.about || "No metadata provided."}"
            </p>

            {/* Skills */}
            {selectedNode.user.skills?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {selectedNode.user.skills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="text-[9px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded uppercase font-mono text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="w-full grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => handleAction("ignored", selectedNode.id)}
                className="py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Drop Node
              </button>
              <button
                onClick={() => handleAction("interested", selectedNode.id)}
                className="py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Connect
              </button>
            </div>

            <button
              onClick={() => navigate(`/profile/${selectedNode.id}`)}
              className="mt-4 text-[10px] text-slate-500 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              View Full Payload
            </button>
          </div>
        </div>
      )}

      {/* Manual Zoom Controls - Keeps native scroll unhijacked! */}
      <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={() => {
            if (graphRef.current)
              graphRef.current.zoom(graphRef.current.zoom() * 1.5, 400);
          }}
          className="w-10 h-10 bg-[#0d1117] border border-slate-800 text-slate-300 rounded-xl shadow-xl hover:bg-slate-800 hover:text-white hover:border-indigo-500/50 flex items-center justify-center font-bold text-xl transition-all cursor-pointer"
        >
          +
        </button>
        <button
          onClick={() => {
            if (graphRef.current)
              graphRef.current.zoom(graphRef.current.zoom() / 1.5, 400);
          }}
          className="w-10 h-10 bg-[#0d1117] border border-slate-800 text-slate-300 rounded-xl shadow-xl hover:bg-slate-800 hover:text-white hover:border-indigo-500/50 flex items-center justify-center font-bold text-xl transition-all cursor-pointer"
        >
          -
        </button>
        <button
          onClick={() => {
            if (graphRef.current) graphRef.current.zoomToFit(800, 80);
          }}
          className="w-10 h-10 bg-[#0d1117] border border-slate-800 text-indigo-400 rounded-xl shadow-xl hover:bg-slate-800 hover:text-indigo-300 hover:border-indigo-500/50 flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
        >
          FIT
        </button>
      </div>
    </div>
  );
};

export default Feed;

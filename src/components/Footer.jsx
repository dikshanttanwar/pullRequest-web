import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] py-12 px-6 font-mono text-gray-500">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-black text-[10px]">PR</span>
              </div>
              <span className="text-white font-black tracking-tighter text-lg italic">
                PullRequest<span className="text-indigo-500">.io</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              // Connecting developers through shared code and mutual interests. 
              Review pull requests, build your network, and find your next collaborative partner.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest">system_links</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link to="/" className="hover:text-indigo-400 transition-colors">/discover</Link>
              <Link to="/connections" className="hover:text-indigo-400 transition-colors">/network</Link>
              <Link to="/requests" className="hover:text-indigo-400 transition-colors">/requests_queue</Link>
              <Link to="/profile" className="hover:text-indigo-400 transition-colors">/settings_config</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest">social_protocols</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#161b22] flex flex-col md:row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
            <span>v1.0.4-stable</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest">
            Copyright © {new Date().getFullYear()} — Engineered by devTinder Labs
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
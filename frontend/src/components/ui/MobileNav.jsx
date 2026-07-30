import { NavLink } from "react-router-dom";
import { Home, Compass, ListMusic, Heart, Settings } from "lucide-react";

export default function MobileNav() {
  const items = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Explore", icon: Compass },
    { path: "/library", label: "Library", icon: ListMusic },
    { path: "/favorites", label: "Liked", icon: Heart },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0917]/95 backdrop-blur-2xl border-t border-purple-500/20 px-3 py-2 flex items-center justify-around shadow-2xl">
      {items.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? "text-purple-300 font-bold bg-purple-500/20 shadow-sm"
                : "text-zinc-400 font-medium hover:text-white"
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

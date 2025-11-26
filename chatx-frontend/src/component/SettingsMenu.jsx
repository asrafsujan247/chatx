import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Bell,
  UserPlus,
  Volume2,
  VolumeOff,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

// SettingsMenu component
export const SettingsMenu = ({
  onAddContactClick,
  onRequestsClick,
  requestCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Handle menu item click
  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    action();
  };

  // Handle sound toggle
  const handleSoundToggle = () => {
    // Play click sound before toggling (always play if sound is enabled)
    if (isSoundEnabled) {
      const clickSound = new Audio("/sounds/mouse-click.mp3");
      clickSound.play().catch((e) => console.log("Audio play failed:", e));
    }
    // Toggle the sound setting
    toggleSound();
    // If we just turned sound ON, play a confirmation sound
    if (!isSoundEnabled) {
      setTimeout(() => {
        const confirmSound = new Audio("/sounds/mouse-click.mp3");
        confirmSound.play().catch((e) => console.log("Audio play failed:", e));
      }, 100);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-all duration-200 ${
          isOpen ? "bg-slate-700/50 text-cyan-400 scale-95" : ""
        }`}
        aria-label="Settings"
      >
        <Settings
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl overflow-hidden z-50 animate-fadeInScale`}
        >
          {/* Notifications */}
          <button
            onClick={() => handleMenuItemClick(onRequestsClick)}
            className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-colors group"
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {requestCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {requestCount}
                </span>
              )}
            </div>
            <span className="flex-1 text-left">Friend Requests</span>
            {requestCount > 0 && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                {requestCount}
              </span>
            )}
          </button>

          {/* Add Friend */}
          <button
            onClick={() => handleMenuItemClick(onAddContactClick)}
            className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-colors group"
          >
            <UserPlus className="w-5 h-5" />
            <span className="flex-1 text-left">Add Friend</span>
          </button>

          {/* Divider */}
          <div className="border-t border-slate-700/50 my-1"></div>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-colors group"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeOff className="w-5 h-5" />
            )}
            <span className="flex-1 text-left">
              {isSoundEnabled ? "Sound On" : "Sound Off"}
            </span>
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                isSoundEnabled ? "bg-cyan-500" : "bg-slate-600"
              } relative`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  isSoundEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              ></div>
            </div>
          </button>

          {/* Divider */}
          <div className="border-t border-slate-700/50 my-1"></div>

          {/* Logout */}
          <button
            onClick={() => handleMenuItemClick(logout)}
            className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

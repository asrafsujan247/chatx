import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { SettingsMenu } from "./SettingsMenu";

export const ProfileHeader = ({
  onAddContactClick,
  onRequestsClick,
  requestCount,
}) => {
  // auth store methods
  const { authUser, updateProfile } = useAuthStore();
  // selected image state
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  // handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="p-5 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-12 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-sm max-w-[180px] truncate">
              {authUser.fullName.length > 13
                ? authUser.fullName.slice(0, 14) + " ..."
                : authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* SETTINGS MENU */}
        <SettingsMenu
          onAddContactClick={onAddContactClick}
          onRequestsClick={onRequestsClick}
          requestCount={requestCount}
        />
      </div>
    </div>
  );
};

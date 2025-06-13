import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {

  const { getAllUsersForSidebar, users, setSelectedUser, selectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  const { onlineUsers, authUser, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  const allUsers = users || [];
  // console.log(allUsers)

  // Close dropdown if clicked outside
  useEffect(() => {
    getAllUsersForSidebar()
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-[20vw] lg:w-80 border-r-2 border-white bg-zinc-900 text-white h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 relative">
        <div className="flex items-center gap-2">
          <img src={assets.logo_icon} alt="Logo" className="w-9" />
          <h2 className="text-xl font-semibold">EasyChat</h2>
        </div>

        {/* Triple Dot Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-white text-xl font-bold px-2 hover:text-gray-400"
          >
            &#x22EE;
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User List */}
      <ul className="divide-y divide-zinc-800">
        {allUsers.map((user) => (
          <li
            key={user._id}
            className={`flex justify-between items-center pr-3 hover:bg-zinc-700 hover:cursor-pointer ${user._id === selectedUser?._id && "bg-zinc-800"}`}
            onClick={() => {
              setSelectedUser(user)
              setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
            }}
          >
            <div className="flex items-center gap-4 p-4 cursor-pointer ">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={user.fullname}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-900 ${onlineUsers.includes(user._id)
                    ? "bg-green-500"
                    : "bg-zinc-500"
                    }`}
                />
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium">{user.fullname}</p>
              </div>
            </div>
            {unseenMessages[user._id]>0 && <span className="w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full border-2 border-white bg-white text-black">{unseenMessages[user._id]}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

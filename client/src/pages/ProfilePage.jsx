// src/pages/ProfilePage.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateBio, updateProfilePicture } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profilePicture, stProfilePicture] = useState(authUser?.profilePicture || "");
  const [name, setName] = useState(authUser?.fullname || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        await updateProfilePicture({ profilePicture: reader.result });
        toast.success("Profile picture updated");
      };
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // ───────────────────────────────────────── handle save ──
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateBio({ fullName: name, bio });
      toast.success("Profile updated");
      navigate("/");                       // go home if you like
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* ─── Side A • profile picture ─────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center gap-6 p-10 border-zinc-800 lg:border-r">
        <div className="relative w-40 h-40">
          <img
            src={authUser?.profilePicture || "/default-avatar.png"}
            alt="profile"
            className="w-full h-full rounded-full object-cover border-4 border-zinc-700"
          />
          <label className="absolute bottom-1 right-1 bg-zinc-800/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-zinc-700">
            📸
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>
        <p className="text-zinc-400">{authUser?.email}</p>
      </section>

      {/* ─── Side B • editable form ──────────────────────────────────── */}
      <section className="flex-1 overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-zinc-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring focus:ring-green-600/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-1 text-sm text-zinc-400">Bio</label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 resize-none focus:outline-none focus:ring focus:ring-green-600/30"
            />
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;


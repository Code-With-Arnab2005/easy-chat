import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Loader from "../components/Loader";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

const SetBioPage = () => {
  
  const { updateBio, authUser } = useContext(AuthContext);
  const [bio, setBio] = useState(authUser?.bio);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      await updateBio({bio});
      navigate("/");
    } catch (error) {
      console.log("some error occured", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#121212] border border-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-1">
          Almost Completed 👋
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Set Your Profile Bio
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Your Bio..."
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-4 py-6 rounded-xl bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {loading ? <Loader /> : (
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
            >
              Save
            </button>
          )}
        </form>
      </motion.div>
    </div>
  )
}

export default SetBioPage

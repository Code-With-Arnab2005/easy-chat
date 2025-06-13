import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Loader from "../components/Loader";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AuthForm = ({ type }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        if(type==='signup'){
            try {
                console.log(type);
                await login('signup', {fullname, email, password});
                navigate("/set-bio");
            } catch (error) {
                console.log("some error occured", error)
            }

        } else {
            try {
                await login('login', {email, password});
                navigate("/");
            } catch (error) {
                console.log("some error occured", error)
            }
        }
        setLoading(false)
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#121212] border border-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md"
            >
                {type==='login'? (
                    <>
                        <h2 className="text-white text-2xl font-semibold text-center mb-1">
                            Welcome Back 👋
                        </h2>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Login to continue chatting
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-white text-2xl font-semibold text-center mb-1">
                            Join The Chatting App 👋
                        </h2>
                        <p className="text-gray-400 text-sm text-center mb-6">
                            Create a new account
                        </p>
                    </>
                ) }

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type==='signup' && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullname}
                            onChange={e => setFullname(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-xl bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {loading ? <Loader /> : (
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl transition"
                    >
                        {type==='signup' ? "Signup" : "Login"}
                    </button>
                    )}
                </form>
                {type==='signup' 
                ? <p className="text-center mt-2">Already have an account? <a className="hover:underline hover:text-blue-700" href="/login">Login</a></p>
                : <p className="text-center mt-2">Don't have an account? <a className="hover:underline hover:text-blue-700" href="/sign-up">Signup</a></p>
                }
                {
                    error && error.length > 0 && <p className="text-center text-red-500 mt-2">{error}</p>
                }
                

                <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 h-px bg-gray-700" />
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-700" />
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-[#1e1e1e] border border-gray-700 hover:bg-[#2a2a2a] text-white py-2 rounded-xl transition">
                    <FcGoogle size={20} />
                    Continue with Google
                </button>
            </motion.div>
        </div>
    );
};

export default AuthForm;

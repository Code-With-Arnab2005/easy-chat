import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SetbioPage from './pages/SetBioPage';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from './components/Loader';

function App() {
  
  const { authUser, loadingAuth } = useContext(AuthContext);

  if(loadingAuth){
    return (
      <>
        <Loader />
      </>
    )
  }
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e1e1e',
            color: '#fff',
            border: '1px solid #4b5563',
          },
        }}
      />
      {/* background picture = bg-[url('./src/assets/bgImage.svg')] bg-contain*/}
      <div className="bg-black text-white">
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/sign-up' element={!authUser ? <SignupPage /> : <Navigate to="/set-bio" />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path='/set-bio' element={authUser ? <SetbioPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  )
}

export default App

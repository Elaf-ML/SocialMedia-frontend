import { useQuery } from '@tanstack/react-query';
import { Routes, Route ,Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LogInPage';
import Notification from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
    const { data :authUser, isLoading } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: 'include',
                });
                const data = await res.json();

                if (data.error){
                    return null;
                }

                if (!res.ok) {
                    throw new Error(data.message || "An error occurred.");
                }
                console.log("Auth user is Here : ", data);
                return data;
            } catch (error) {
                throw new Error(error.response ? error.response.data : error.message);
            }
        },
    });


    return (
        <div className='flex max-w-6xl mx-auto'>
       { authUser && <Sidebar /> }
            <Routes>
                <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path='/notifications' element={ authUser ? <Notification /> : <Navigate to="/login"/>} />
                <Route path='/profile/:username' element={ authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
            </Routes>
           
        </div>
        
    );
}

export default App;
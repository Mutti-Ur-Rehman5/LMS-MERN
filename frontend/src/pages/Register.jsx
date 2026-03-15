import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const role = 'student'; // ✅ Fixed role
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // 1️⃣ Register API call (always student)
            await axios.post('http://localhost:5000/api/auth/register', { name,email,password,role });
            alert('Registered successfully!');

            // 2️⃣ Auto-login
            try {
                const loginRes = await axios.post('http://localhost:5000/api/auth/login', { email, password });

                if(loginRes.data && loginRes.data.token){
                    localStorage.setItem('token', loginRes.data.token);
                    localStorage.setItem('user', JSON.stringify(loginRes.data.user));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.token}`;

                    const userRole = loginRes.data.user.role;
                    if(userRole === 'student') navigate('/student');
                    else navigate('/login'); // fallback
                } else {
                    navigate('/login');
                }

            } catch(err) {
                console.log("Auto-login failed:", err);
                navigate('/login'); // fallback
            }

        } catch(err) {
            alert(err.response?.data?.error || 'Error');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded shadow-md w-96 text-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"/>
                <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"/>
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"/>

                {/* Student only – no dropdown */}
                <input type="text" value="Student" disabled className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-gray-400 text-center"/>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white">Register</button>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
                </p>
            </form>
        </div>
    )
}
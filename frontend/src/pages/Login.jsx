import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email,password });

            // ✅ Save JWT + user
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert('Login success!');

            // ✅ Set Axios default Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            // Redirect based on role
            const role = res.data.user.role;
            if(role === 'student') navigate('/student');
            else if(role === 'teacher') navigate('/teacher');
            else if(role === 'admin') navigate('/admin');

        } catch(err) {
            alert(err.response?.data?.error || 'Error');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded shadow-md w-96 text-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"/>
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
                    className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"/>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white">Login</button>
                <p className="mt-4 text-center text-gray-400">
                    Don't have an account? <a href="/register" className="text-blue-400 hover:underline">Register</a>
                </p>
            </form>
        </div>
    )
}
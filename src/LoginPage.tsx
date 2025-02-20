import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { login, fetchUserData } from './redux/slices/authSlice';

export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.auth)

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(login(credentials)).unwrap();
            await dispatch(fetchUserData()).unwrap();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex justify-center items-center h-screen'>
            <div className='flex flex-col justify-center items-center w-1/3'>
                <div className='mb-4 w-full'>
                    <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                        required
                    />
                </div>
                <div className='mb-4 w-full'>
                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className='mt-1 p-2 border border-gray-300 rounded-md w-full'
                        required
                    />
                </div>
                {error && <div className='text-red-500 mb-4'>{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 w-full'
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </div>
        </form>
    );
};
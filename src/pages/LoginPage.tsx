import React, { useState, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../axios.config';
import { useDispatch } from 'react-redux';
import { login } from '../store/authslice';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      console.log('Form submitted:', formData);
      const response = await axiosInstance.post('/auth/login', formData);
      console.log('Response:', response.data);
      dispatch(login(formData.email)); 
      navigate('/dashboard'); 

    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.data === "Invalid email or password") {
        setError('Invalid email or password');
      } else {
        setError('An error occurred');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Login Page</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Email:
            <input
              className="form-input mt-1 block w-full"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <label className="block mb-2">
            Password:
            <input
              className="form-input mt-1 block w-full"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-500">Register now</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

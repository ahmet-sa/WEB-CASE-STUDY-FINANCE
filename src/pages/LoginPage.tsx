import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
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
      const response = await axiosInstance.post('/auth/login', formData);
      let token = response.data.data; 
      dispatch(login()); 
      localStorage.setItem('token', token); 
      navigate('/dashboard'); 
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.data === "Invalid email or password") {
        setError('Invalid email or password');
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen bg-background">
      <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-primary text-center">Login Page</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-primary">
            Email:
            <input
              className="form-input text-black rounded mt-1 border-1 h-6 border-primary-light block w-full"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <label className="block mb-2 text-primary">
            Password:
            <input
              className="form-input mt-1 block w-full rounded border-1 h-6 border-primary-light  "
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <div className='w-full flex justify-center items-center'>
          <button className="#F5F5F5  text-white w-30 bg-primary align-center  items-center  px-4 py-2 rounded-md mt-4" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
          </div>
       
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-primary-light hover:text-primary  ">Register now</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

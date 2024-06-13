import React, { useState, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../axios.config';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      setError('Name must contain only letters and numbers.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be 6-12 characters long and contain only letters and numbers.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/auth/register', formData);
      console.log('Response:', response.data);
      navigate('/login');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.status === 'error' && error.response.data.data === 'User already exists') {
          setError('User already exists. Please use a different email.');
        } else {
          setError('Registration error: ' + (error.response.data.message || 'An unknown error occurred.'));
        }
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateName = (name: string): boolean => {
    const namePattern = /^[a-zA-Z0-9]+$/; // Alphanumeric characters only
    return namePattern.test(name);
  };

  const validatePassword = (password: string): boolean => {
    const passwordPattern = /^[a-zA-Z0-9]{6,12}$/; // 6-12 characters, alphanumeric only
    return passwordPattern.test(password);
  };

  return (
    <div className="w-full flex items-center justify-center h-screen bg-background">
      <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-primary text-center">Register Page</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-primary">
            Name:
            <input
              className="form-input text-black rounded mt-1 border-1 h-6 border-primary-light block w-full"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
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
              className="form-input mt-1 block w-full rounded border-1 h-6 border-primary-light"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <div className='w-full flex justify-center items-center'>
            <button className="#F5F5F5 text-white w-20 bg-primary align-center items-center px-4 py-2 rounded-md mt-4" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-primary-light hover:text-primary">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

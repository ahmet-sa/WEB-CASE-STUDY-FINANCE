import React, { useState, ChangeEvent, FormEvent } from 'react';
import axiosInstance from '../axios.config'; 

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
      const response = await axiosInstance.post('/auth/register', formData);
      console.log('Response:', response.data);
      // Handle successful registration
    } catch (err) {
      setError('An error occurred');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Register Page</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:
          <input
            className="form-input mt-1 block w-full"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>
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
          {loading ? 'Loading...' : 'Register'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-blue-500">Login here</a>
      </p>
    </div>
  );
}

export default RegisterPage;

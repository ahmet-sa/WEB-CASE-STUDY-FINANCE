// LoginPage.tsx

import React, { useState } from 'react';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form gönderildi:', formData);
      // Burada giriş formunu gönderme işlemini gerçekleştirebilirsiniz
    } catch (error) {
      console.error('Giriş hatası:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Giriş Sayfası</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          E-posta:
          <input className="form-input mt-1 block w-full" type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label className="block mb-2">
          Parola:
          <input className="form-input mt-1 block w-full" type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4" type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}

export default LoginPage;

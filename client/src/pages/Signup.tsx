import { useState } from 'react';
import api from '../api';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { Link } from 'react-router-dom';

type FormDataType = {
  email: string;
  password: string;
  name: string;
};

function SignUp() {
  const [data, setData] = useState<FormDataType>({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const createAccount = async (data: FormDataType): Promise<void> => {
    try {
      const response: AxiosResponse<{ message: string }> = await api.post('/user', data);
      if (response.status === 201) {
        setSuccess(true)
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    createAccount(data);
    setData({
      email: '',
      password: '',
      name: ""
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (error) setError("")
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Create account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-3/12 mt-6">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          className="p-2 rounded-md border border-gray-300 h-10 px-2"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={data.name}
          onChange={handleChange}
          className="p-2 rounded-md border border-gray-300  h-10 px-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="p-2 rounded-md border border-gray-300  h-10 px-2"
        />
        <button type="submit" className="p-2 rounded-md bg-blue-500 text-white h-10 mt-2 cursor-pointer">
          Create account
        </button>
      </form>
      <Link to='/login' className='mt-4 text-blue-500'>Login</Link>
      {success && <div className="text-green-500 mt-2">
        <span>User created. </span><Link to='/login' className='mt-4 text-blue-500 cursor-pointer'>Login</Link></div>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default SignUp;

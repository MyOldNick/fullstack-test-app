import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import History from '../components/History';
import AddSoultionForm from '../components/AddSolutionForm';
import type { CreateSolution, Solution } from '../common/types';
import axios from 'axios';

const LIMIT = 100;

function Dashboard() {
  const [history, setHistory] = useState<Solution[]>([]);
  const [error, setError] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, setAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getHistory = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/llm/solution', {
        params: {
          skip,
          limit: LIMIT,
        },
      });
      if (response.status === 200) {
        setHistory((state) => [...state, ...response.data]);

        if (response.data?.length < LIMIT) setHasMore(false);
      }
      setSkip(skip + LIMIT);
    } catch (error) {
      console.log(error);
      setHasMore(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [skip]);

  const addSolution = useCallback(async (data: CreateSolution): Promise<void> => {
    if (error) setError('');
    try {
      const result = await api.post('/llm/solution', data);
      if (result.status === 201) {
        setHistory((state) => [result.data, ...state]);
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
    }
  }, []);

  const logout = async () => {
    try {
      const result = await api.delete('/auth/logout');
      if (result.status === 200) {
        setAuthenticated(false);
        navigate('/login', { replace: true });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <>
      <div className="flex justify-end p-4">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center pt-10 gap-10">
        <h1>Welcome {user?.name}</h1>
        <p className="text-red-500 h-10 max-w-1/2">{error && <span>{error}</span>}</p>
        <div className="flex w-full">
          <AddSoultionForm action={addSolution} />
          <History history={history} hasMore={hasMore} getHistory={getHistory} loading={loading} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

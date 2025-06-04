import { useNavigate } from 'react-router-dom';

export default function GithubError() {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">GitHub Link Failed</h1>
        <p className="text-slate-400 mb-6">This GitHub account is already linked to another user.</p>
        <button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 px-4">
          Go to Home
        </button>
      </div>
    </section>
  );
}
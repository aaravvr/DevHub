// Import routing components for client-side routes
import { Routes, Route } from 'react-router-dom';

// Import page components
import HomePage from './pages/HomePage';
import CreateProjectPage from './pages/CreateProjectPage';

// Navigation controller for all app routes
const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreateProjectPage />} />
  </Routes>
);

export default App;
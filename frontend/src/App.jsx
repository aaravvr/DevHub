// Import routing components for client-side routes
import { Routes, Route } from 'react-router-dom';


// Import page components
import HomePage from './pages/HomePage';
import CreateProject from './pages/CreateProject';

// Navigation controller for all app routes
const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreateProject />} />
  </Routes>
);

export default App;
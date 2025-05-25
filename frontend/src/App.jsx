// Import routing components for client-side routes
import { Routes, Route } from 'react-router-dom';

// Import page components
import HomePage from './pages/HomePage';
import CreateProject from './pages/CreateProject';
import ViewProject from './pages/ViewProject';

// Navigation controller for all app routes
const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/create" element={<CreateProject />} />
    <Route path="/:id" element={<ViewProject />} />
  </Routes>
);

export default App;
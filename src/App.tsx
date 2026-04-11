
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PortfolioGrid from './pages/PortfolioGrid';
import PortfolioDetail from './pages/PortfolioDetail';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectBuilder from './pages/admin/ProjectBuilder';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<PortfolioGrid />} />
      <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/portfolio" element={<AdminDashboard />} />
      <Route path="/admin/portfolio/new" element={<ProjectBuilder />} />
      <Route path="/admin/portfolio/:id" element={<ProjectBuilder />} />
    </Routes>
  );
}
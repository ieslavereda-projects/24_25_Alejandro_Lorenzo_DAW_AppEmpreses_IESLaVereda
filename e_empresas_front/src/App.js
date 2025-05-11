import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddUserPage from './pages/AddUserPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/add-user"
          element={
            <ProtectedRoute requiredRole="admin" element={<AddUserPage />} />
          }
        />
        
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Event from './pages/Event';
import Events from './pages/Events';

export default function App() {
    return (   
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/events" element={<Events />} />
      </Routes>
    );
}
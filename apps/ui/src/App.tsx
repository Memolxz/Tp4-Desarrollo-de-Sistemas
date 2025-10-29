import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateEvent from './pages/CreateEvent'
import { RequireAuth, RequireGuest } from './components/ProtectedRoute'
import Profile from "./pages/Profile"
import Payment from "./pages/Payment"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Events from './pages/Events'
import Event from './pages/Event'
import Home from "./pages/Home"

export default function App() {
    return (   
      <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/createevent" element={<RequireAuth><CreateEvent /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/payment/:id" element={<RequireAuth><Payment /></RequireAuth>} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/signin" element={<RequireGuest><SignIn /></RequireGuest>} />
          <Route path="/signup" element={<RequireGuest><SignUp /></RequireGuest>} />
          <Route path="/events" element={<Events />} />
          <Route path="/home" element={<Home />} />
      </Routes>
    );
}
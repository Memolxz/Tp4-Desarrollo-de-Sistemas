import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateEvent from './pages/CreateEvent'
import { RequireAuth } from './components/ProtectedRoute'
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
          <Route path="/createevent" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/events" element={<Events />} />
          <Route path="/home" element={<Home />} />
      </Routes>
    );
}
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './components/home/home'
import Header from './components/header/header'
import Profile from './components/profile/profile'
import Error_Page from './components/error_page/error_page'
import JobPage from "./components/job_page/job_page";
import Help from "./components/help_page/help_page";
import { UserProvider } from './context/UserContext';
/**
 * The main component of the application. It contains the routes for the different pages.
 * 
 */
function App() {
  return (
    <>
    <UserProvider>
    <Router>
    <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/job_page" element={<JobPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Error_Page />} />
      </Routes>
    </Router>
    <footer>
        <p>&copy; 2024 Mercantec 3D Print Archive. All rights reserved.</p>
    </footer>
    </UserProvider>
    </>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './components/home/home'
import Header from './components/header/header'
import Login from './components/login/login'
import Profile from './components/profile/profile'
import Signup from './components/signup/signup'
import Error_Page from './components/error_page/error_page'


function App() {
  return (
    <>
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error_Page />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
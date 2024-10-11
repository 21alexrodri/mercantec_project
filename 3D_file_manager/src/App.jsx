import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './components/home/home'
import Header from './components/header/header'
import Profile from './components/profile/profile'
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
        <Route path="*" element={<Error_Page />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
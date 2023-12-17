import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import SDKTest from './pages/SDKTest';
import UserProfile from './pages/NotifiTest';
// import Notifi from './pages/NotifiTest';


function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>}></Route>
          <Route path='/test' element={<TestPage/>}></Route>
          <Route path='/sdk' element={<SDKTest/>}></Route>
          <Route path='/profile' element={<UserProfile/>}></Route>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App

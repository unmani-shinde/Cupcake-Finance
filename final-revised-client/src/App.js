import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './webpages/Home';
import UserAuthentication from './webpages/UserAuth';
import UserDashboard from './webpages/UserDashboard';
import InvestmentPortfolio from './webpages/InvestmentPortfolio';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/get-started' element={<UserAuthentication/>}/>
          <Route path='/dashboard-home' element={<UserDashboard/>}/>
          <Route path='/investment-portfolio' element={<InvestmentPortfolio/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useState, useEffect} from 'react';
// import axios from 'axios';
import Navbar from './components/Navbar';
// import Stats from './components/Stats';
// import DApp from './components/DApp';

// mapping supporting CrowdfundingPhase enum from the contract
const userType = {
  0: 'customer',
  1: 'insurance worker',
  2: 'insurance manager',
  3: 'authority',
  4: 'car repair'
};

function App() {
  // const [contract, setContract] = useState();
  // const [user, setUser] = useState({user: userType[0]});
  // const [quote, setQuote] = useState([]);

  return (
    <div className="bg-light">
      <Navbar />
    </div>
  );
}

export default App;

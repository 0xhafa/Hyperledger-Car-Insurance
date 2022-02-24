import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useState, useEffect} from 'react';
// import axios from 'axios';
import Navbar from './components/Navbar';
import Policies from './components/Policies';
import Quotes from './components/Quotes';
import Claims from './components/Claims';
import Form from 'react-bootstrap/Form'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  const [user, setUser] = useState("");
  // const [quote, setQuote] = useState([]);

  useEffect(async () => {
    setUser(JSON.parse(window.localStorage.getItem('user')));
  },[])

  useEffect(() => {
      window.localStorage.setItem('user', JSON.stringify(user));
  }, [user])

  const handleUser = (e) => {
      setUser(e.target.value); 
  }

  
  return (
    <div className="bg-light">
      <Form.Select onChange = { handleUser } value={ user } size="sm" >
        <option disabled>Select User Type</option>
        <option value="Customer">Customer</option>
        <option value="InsuranceWorker">Insurance Worker</option>
        <option value="InsuranceManager">Insurance Manager</option>
        <option value="Authority">Authority</option>
      </Form.Select>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="quotes" element={<Quotes user={user}/>} />
          <Route path="policies" element={<Policies user={user}/>} />
          <Route path="claims" element={<Claims user={user}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

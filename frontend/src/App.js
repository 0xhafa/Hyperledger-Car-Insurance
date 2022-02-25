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
import {urlContext} from './components/urlContext';

function App() {
  const [user, setUser] = useState("Customer 1");
  // const [quote, setQuote] = useState([]);

  const handleUser = (e) => {
      setUser(e.target.value); 
  }
  
  return (
    <urlContext.Provider value={'http://34.136.154.88:5986'}>
      <div className="bg-light">
        <Form.Select onChange = { handleUser } value={ user } size="sm" >
          <option disabled>Select User Type</option>
          <option value="Customer 1">Customer 1</option>
          <option value="Customer 2">Customer 2</option>
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
    </urlContext.Provider>
  );
}

export default App;

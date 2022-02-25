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
  const [user, setUser] = useState("customer1");

  const handleUser = (e) => {
      setUser(e.target.value); 
  }
  
  return (
    <urlContext.Provider value={'http://34.136.154.88:5986'}>
      <div className="bg-light">
        <Form.Select onChange = { handleUser } value={ user } size="sm" >
        <option disabled>Select User Type</option>
            <option value="customer1">Customer 1</option>
            <option value="customer2">Customer 2</option>
            <option value="worker">Insurance Worker</option>
            <option value="manager">Insurance Manager</option>
            <option value="adjuster">Insurance Adjuster</option>
            <option value="bookkeeper">Bookkeeper</option>
            <option value="reader">Authority</option>
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

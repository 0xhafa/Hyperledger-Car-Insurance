import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Popover from 'react-bootstrap/Popover';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { urlContext } from './urlContext';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';

const Policy = (props) => {
  const url = React.useContext(urlContext);
  const [claimForm, setClaimForm] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [claimPolicy, setClaimPolicy] = useState(0);
  const [claimDescription, setClaimDescription] = useState("");

  const testPolicies = [{
    Status: 'PENDING',
    StartDate: '0',
    EndDate: '0',
    MainDriver: {
        FirstName: 'Teste', 
        LastName: 'da Silva', 
        Address: '123 Street', 
        DriversLicenseNo: '0000000-0'
    },
    Car: {
        Make: 'Fiat',
        Model: 'Marea',
        Year: '1998',
        LicensePlate: 'XYZX-000'
    },
    Coverage: {
        BodilyInjuryLiability:    {Name:"Bodily Injury", Active: true,  CoveredAmount: 9000, ClaimedToDate: 0},
        PropertyDamageLiability:  {Name:"Property Damage", Active: true,  CoveredAmount: 15000, ClaimedToDate: 0},
        Collision:                {Name:"Collision", Active: false, CoveredAmount: 0, ClaimedToDate: 0},
        Comprehensive:            {Name:"Comprehensive", Active: false, CoveredAmount: 0, ClaimedToDate: 0},
        PersonalInjuryProtection: {Name:"Personal Injury", Active: false, CoveredAmount: 0, ClaimedToDate: 0},
        UnderinsuredMotorist:     {Name:"Underinsured Motorist", Active: false, CoveredAmount: 0, ClaimedToDate: 0}
    }
  },
  {
    Status: 'ACTIVE',
    StartDate: '0',
    EndDate: '0',
    MainDriver: {
        FirstName: 'Teste', 
        LastName: 'da Silva', 
        Address: '123 Street', 
        DriversLicenseNo: '0000000-0'
    },
    Car: {
        Make: 'Fiat',
        Model: 'Marea',
        Year: '1998',
        LicensePlate: 'XYZX-000'
    },
    Coverage: {
        BodilyInjuryLiability:    {Name:"Bodily Injury", Active: true,  CoveredAmount: 9000, ClaimedToDate: 0},
        PropertyDamageLiability:  {Name:"Property Damage", Active: true,  CoveredAmount: 15000, ClaimedToDate: 0},
        Collision:                {Name:"Collision", Active: true, CoveredAmount: 99999, ClaimedToDate: 0},
        Comprehensive:            {Name:"Comprehensive", Active: false, CoveredAmount: 0, ClaimedToDate: 0},
        PersonalInjuryProtection: {Name:"Personal Injury", Active: false, CoveredAmount: 0, ClaimedToDate: 0},
        UnderinsuredMotorist:     {Name:"Underinsured Motorist", Active: false, CoveredAmount: 0, ClaimedToDate: 0}
    }
  }]

  useEffect(() => {
    setPolicies(testPolicies);
    console.log(props.user)
    //Axios.get(`${url}/getPolicies`, props.user)
  },[])

  function selectStatus(status){
    switch(status){
      case "PENDING":
        return "Pending ⚪";
      case "ACTIVE":
        return "Active 🟢";
      case "EXPIRED":
        return "Expired 🔴";
      case "SUSPENDED":
        return "Suspended 🟡";
    }
  }

  function setField(value) {
    setClaimDescription(value);
  }

  function closeClaim() {
    setClaimForm(false);
  }

  function openClaim(i) {
    setClaimPolicy(i);
    setClaimForm(true);
  }

  function addClaim() {
    setClaimForm(false);
    setClaimDescription("");
    //Axios.get(`${url}/activatePolicy`, [claimPolicy, claimDescription])
    // .then(setPolicies(res.data))
  }

  function activatePolicy(i) {
    let policies_ = [...policies];
    policies_[i].Status = "ACTIVE";
    setPolicies(policies_);
    //Axios.get(`${url}/activatePolicy`, i)
    // .then(setPolicies(res.data))
  }

  function suspendPolicy(i) {
    let policies_ = [...policies];
    policies_[i].Status = "SUSPENDED";
    setPolicies(policies_);
    //Axios.get(`${url}/suspendPolicy`, i)
    // .then(setPolicies(res.data))
  }
  
  function expirePolicy(i) {
    let policies_ = [...policies];
    policies_[i].Status = "EXPIRED";
    setPolicies(policies_);
    //Axios.get(`${url}/expirePolicy`, i)
    // .then(setPolicies(res.data))
  }


  return (
    <div className='containerReact'>
      <div className="w-75 mt-4 mb-4" bg="light">
        <h1>Policies</h1>
        <Modal show={claimForm} onHide={closeClaim}>
          <Modal.Header closeButton>
          <Modal.Title>Claim</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group className="mb-3" controlId="quoteForm.Carear">
            <Form.Label>What happened?</Form.Label>
            <Form.Control  
              type="int" 
              as="textarea" rows={3} 
              onChange={e => setField(e.target.value)}
            />
          </Form.Group>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={closeClaim}>
            Close
          </Button>
          <Button variant="primary" onClick={addClaim}>
            Send Claim
          </Button>
          </Modal.Footer>
        </Modal>
      <div className="w-75 mt-4 mb-4" bg="light">
          {policies.length === 0 ? 
          "" : 
          <Row xs={1} md={1} xl={2} className="g-3">
            {policies.map((policy, i) => (
              <Col key={i}>
              <Card bg="light" className="h-100">
              <Card.Header>
                {`Status: ${selectStatus(policy.Status)}`}
              </Card.Header>
                <OverlayTrigger trigger="click" placement="top" overlay={
                  <Popover id="popover-basic">
                    <Popover.Header as="h3">Policy Details</Popover.Header>
                    <Popover.Body>
                      {JSON.stringify(policy.MainDriver)}
                    </Popover.Body>
                  </Popover>
                }>                                        

                <Card.Body id={i}>
                  <Card.Text id={i}>
                    <ListGroup>
                      {Object.values(policy.Coverage).map((cover) => (
                        <ListGroup.Item className="d-flex">{`${cover.Active? '✅': '❌'} ${cover.Name} ${cover.CoveredAmount === 0 ? "" : `$ ${cover.CoveredAmount}`}`}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Text>
                  <Card.Text id={i} style={{fontWeight: 'bold'}}>
                    Click to see policy details
                  </Card.Text>
                </Card.Body>

                  </OverlayTrigger>
                  <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                  <div className="col text-center">
                      {(props.user === "Customer 1" || props.user === "Customer 2")
                        && policy.Status === "ACTIVE" ?
                        
                      <Button variant="primary"
                        className="w-25"
                        size="sm"
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {openClaim(i)}}>
                        Add Claim
                      </Button>
                       : 
                      (props.user === "InsuranceManager" || props.user === "InsuranceWorker") 
                      && policy.Status === "PENDING" ? 
                      <Button variant="primary"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {activatePolicy(i)}}>
                        Activate
                      </Button> :
                      (props.user === "InsuranceManager") 
                      && policy.Status === "ACTIVE" ? 
                      <>
                      <Button variant="warning"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {suspendPolicy(i)}}>
                        Suspend
                      </Button>
                      <Button variant="danger"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {expirePolicy(i)}}>
                        Expire
                      </Button>
                      </> : 
                      props.user === "InsuranceWorker" 
                      && policy.Status === "ACTIVE" ? 
                      <Button variant="danger"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {expirePolicy(i)}}>
                        Expire
                      </Button>
                      : ""
                      }
                    </div>
                  </Card.Footer>
              </Card>
              </Col>
            ))}
          </Row>}
        </div>
      </div>
    </div>
  );
};

export default Policy;



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

  useEffect(() => {
    getPolicies();
    //eslint-disable-next-line react-hooks/exhaustive-deps 
  },[props.user])

  function selectStatus(State){
    switch(State){
      case "PENDING":
        return "Pending ⚪";
      case "ACTIVE":
        return "Active 🟢";
      case "EXPIRED":
        return "Expired 🔴";
      case "SUSPENDED":
        return "Suspended 🟡";
      default:
        return "Not Found"
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

  function getPolicies() {
    if(props.user === "customer1" || props.user === "customer2"){
      Axios.get(`${url}/allPoliciesUser?userId=${props.user}&id=${props.user}`)
      .then((res)=>{
        setPolicies(res.data)
        console.log("POLICY UPDATED: ", res.data)
      })
    } else {
      Axios.get(`${url}/allPolicies?userId=${props.user}`)
      .then((res)=>{
        setPolicies(res.data)
        console.log("POLICY UPDATED: ", res.data)
      })
    }
  }

  function addClaim() {
    Axios.post(`${url}/addClaim`, {userId:props.user, policyNo:policies[claimPolicy].PolicyNo, claimDescription: claimDescription})
    .then((res) => {
      getPolicies()
      console.log("CLAIM ADDED")
    })
    setClaimForm(false);
    setClaimDescription("");
  }

  function activatePolicy(i) {
    Axios.get(`${url}/activatePolicy?userId=${props.user}&policyNo=${policies[i].PolicyNo}`)
    .then((res) => {
      getPolicies()
      console.log("POLICY UPDATED: ", policies[i])
    })
  }

  function suspendPolicy(i) {
    Axios.get(`${url}/suspendPolicy?userId=${props.user}&policyNo=${policies[i].PolicyNo}`)
    .then((res) => {
      getPolicies()
      console.log("POLICY UPDATED: ", policies[i])
    })
  }
  
  function expirePolicy(i) {
    Axios.get(`${url}/expirePolicy?userId=${props.user}&policyNo=${policies[i].PolicyNo}`)
    .then((res) => {
      getPolicies()
      console.log("POLICY UPDATED: ", policies[i])
    })
  }


  return (
    <div className='containerReact'>
      <div bg="light">
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
      <div bg="light">
          {policies.length === 0 ? 
          "No Policies to Display" : 
          <Row xs="auto" className="g-3">
            {policies.map((policy, i) => (
              <Col key={i}>
              <Card bg="light" className="h-100">
              <Card.Header>
                {`State: ${selectStatus(policy.State)}`}
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
                      {Object.keys(policy.Coverage).map((type) => (
                        <ListGroup.Item className="d-flex">
                          {`${policy.Coverage[type].Active? '✅': '❌'} 
                          ${type.replace(/([a-z])([A-Z])/g, "$1 $2")}
                          ${policy.Coverage[type].CoveredAmount === 0 ? "" : `$${policy.Coverage[type].CoveredAmount}`}`}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Text>
                  <Card.Text id={i} style={{fontWeight: 'bold'}}>
                    Click to see policy details
                  </Card.Text>
                </Card.Body>

                  </OverlayTrigger>
                  <Card.Footer className="mt-auto" style={{ display: "flex", height: "3rem" }}>
                  <div className="col text-center">
                      {(props.user === "customer1" || props.user === "customer2")
                        && policy.State === "ACTIVE" ?
                        
                      <Button variant="primary"
                        className="w-35"
                        size="sm"
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {openClaim(i)}}>
                        Add Claim
                      </Button>
                       : 
                      (props.user === "manager" || props.user === "worker") 
                      && policy.State === "PENDING" ? 
                      <Button variant="primary"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {activatePolicy(i)}}>
                        Activate
                      </Button> :
                      (props.user === "manager") 
                      && policy.State === "ACTIVE" ? 
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
                      props.user === "worker" 
                      && policy.State === "ACTIVE" ? 
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



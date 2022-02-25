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


const Claim = (props) => {
  const url = React.useContext(urlContext);
  const [claimForm, setClaimForm] = useState(false);
  const [claims, setClaims] = useState([]);
  const [claimPolicy, setClaimPolicy] = useState(0);
  const [claimDescription, setClaimDescription] = useState("");

  const testClaims = [
    {
      PolicyNo: 999999,
      ClaimNo: 1,
      State: "PENDING",
      Description: "Some bad thing happened, please pay me."
    },
    {
      PolicyNo: 999999,
      ClaimNo: 2,
      State: "PENDING",
      Description: "Some bad thing happened again, please pay me again."
    }
  ]

  useEffect(() => {
    setClaims(testClaims);
    //Axios.get(`${url}/getClaims`, props.user)
  },[])

  function selectStatus(State){
    switch(State){
      case "PENDING":
        return "Pending ⚪";
      case "ACCEPTED":
        return "Active 🟡";
      case "REJECTED":
        return "Rejected 🔴";
      case "PAID_OUT":
        return "Completed 🟢";
    }
  }


  function approveClaim() {
    //Axios.post(`${url}/reviewClaim`, [userId, policyNo, claimId, newState])
    // .then(setClaims(res.data))
  }
  //how much and type of coverage
  // {userId: '',
  // policyNo: '',
  // claimNo: '',
  // newState: 'ACCEPTED/REJECTED',
  // amounts: {
  // BodilyInjuryLiability: 1500,
  // PropertyDamageLiability: 1000
  // }}
  //if rejected hide amounts

  function payoutClaim() {
    //Axios.get(`${url}/payoutClaim`, [userId, policyNo, claimId])
    // .then(setClaims(res.data))
  }

  function rejectClaim() {
    //Axios.get(`${url}/reviewClaim`, [userId, policyNo, claimId, newState])
    // .then(setClaims(res.data))
  }

  return (
  <div className='containerReact'>
    <div className="w-75 mt-4 mb-4" bg="light">
      <h1>Claims</h1>
    <div className="w-75 mt-4 mb-4" bg="light">
          {claims.length === 0 ? 
          "" : 
          <Row xs={1} md={1} xl={2} className="g-3">
            {claims.map((claim, i) => (
              <Col key={i}>
              <Card bg="light" className="h-100">
              <Card.Header>
                {`State: ${selectStatus(claim.State)}`}
              </Card.Header>
                <OverlayTrigger trigger="click" placement="top" overlay={
                  <Popover id="popover-basic">
                    <Popover.Header as="h3">Policy Details</Popover.Header>
                    <Popover.Body>
                      {claim.Description}
                    </Popover.Body>
                  </Popover>
                }>                                        

                <Card.Body id={i}>
                  <Card.Text id={i}>
                    <ListGroup>
                      <ListGroup.Item>{claim.Description}</ListGroup.Item>
                    </ListGroup>
                  </Card.Text>
                </Card.Body>

                  </OverlayTrigger>
                  <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                  <div className="col text-center">
                      {(props.user === "manager" || props.user === "worker") 
                      && claim.State === "PENDING" ?
                      <>
                      <Button variant="primary"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {approveClaim(i)}}>
                        Approve
                      </Button>
                      <Button variant="danger"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {rejectClaim(i)}}>
                        Reject
                      </Button>
                      </>
                      :
                      (props.user === "manager") 
                      && claim.State === "ACCEPTED" ? 
                      <>
                      <Button variant="warning"
                        className="w-25"
                        size="sm"
                        id={i}
                        style={{ marginLeft: "auto" }}
                        onClick={(e) => {payoutClaim(i)}}>
                        Complete
                      </Button>
                      </> 
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
  )
}
export default Claim;



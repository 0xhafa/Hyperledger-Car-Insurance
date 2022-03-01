import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { urlContext } from './urlContext';
import Form from 'react-bootstrap/Form';
import Axios from 'axios';


const Claim = (props) => {
  const url = React.useContext(urlContext);
  const [approveForm, setApproveForm] = useState(false);
  const [confirmationReject, setConfirmationReject] = useState(false);
  const [confirmationPayout, setConfirmationPayout] = useState(false);
  const [claims, setClaims] = useState([]);
  const [claimPolicy, setClaimPolicy] = useState({});
  const [amounts, setAmounts] = useState({
    BodilyInjuryLiability: 0,
    PropertyDamageLiability: 0,
    Collision: 0,
    Comprehensive: 0,
    PersonalInjuryProtection: 0,
    UnderinsuredMotorist: 0
  })

  useEffect(() => {
    getClaims();
    //eslint-disable-next-line react-hooks/exhaustive-deps 
  },[props.user])

  function getClaims() {
    if(props.user === "customer1" || props.user === "customer2"){
      Axios.get(`${url}/allClaimsUser?userId=${props.user}&id=${props.user}`)
      .then((res)=>{
        setClaims(res.data)
        console.log(claims)
      })
    } else {
      Axios.get(`${url}/allClaims?userId=${props.user}`)
      .then((res)=>{
        setClaims(res.data);
        console.log(claims)
      })
    }
  }

  function setField (field, value) {
    setAmounts(form => ({...form, [field]: value}));
    return;
  }

  //CONFIRM APPROVAL
  function closeApproveForm() {
    setApproveForm(false);
  }

  function openApproveForm(i) {
    setClaimPolicy(i);
    setApproveForm(true);
  }

  //CONFIRM REJECTION
  function closeRejectConfirmation() {
    setConfirmationReject(false);
  }

  function openRejectConfirmation(i) {
    setClaimPolicy(i);
    setConfirmationReject(true);
  }

  //CONFIRM PAYOUT
  function closePayoutConfirmation() {
    setConfirmationPayout(false);
  }

  function openPayoutConfirmation(i) {
    setClaimPolicy(i);
    setConfirmationPayout(true);
  }

  function selectStatus(State){
    switch(State){
      case "PENDING":
        return "Pending ⚪";
      case "ACCEPTED":
        return "Accepted 🟡";
      case "REJECTED":
        return "Rejected 🔴";
      case "PAID_OUT":
        return "Paid 🟢";
      default:
        return "Not Found"
    }
  }

  function resetAmounts() {
    setAmounts({
      BodilyInjuryLiability: 0,
      PropertyDamageLiability: 0,
      Collision: 0,
      Comprehensive: 0,
      PersonalInjuryProtection: 0,
      UnderinsuredMotorist: 0
    });
  }

  function approveClaim(i) {
    Axios.post(`${url}/reviewClaim`, {userId: props.user, policyNo: claims[claimPolicy].PolicyNo, claimNo: claims[claimPolicy].ClaimNo, newState: "ACCEPTED", amounts: amounts})
    .then((res) => {
      getClaims()
      console.log("CLAIM APPROVAL: ", res.data)
    })
    resetAmounts()
    closeApproveForm();
  }

  function payoutClaim(i) {
    Axios.post(`${url}/payoutClaim`, {userId: props.user, policyNo: claims[claimPolicy].PolicyNo, claimNo: claims[claimPolicy].ClaimNo})
    .then((res) => {
      getClaims()
      console.log("CLAIM PAYMENT: ", res.data)
    })
    closePayoutConfirmation();
  }

  function rejectClaim() {
      Axios.post(`${url}/reviewClaim`, {userId: props.user, policyNo: claims[claimPolicy].PolicyNo, claimNo: claims[claimPolicy].ClaimNo, newState: "REJECTED", amounts: amounts})
      .then((res) => {
        console.log("CLAIM REJECTED: ", res.data);
        getClaims()
        //checkState(res.data ,"REJECTED");
    });
    closeRejectConfirmation();
  }

  return (
  <div className='containerReact'>
    <div bg="light">
      <h1>Claims</h1>
      <Modal show={confirmationReject} onHide={closeRejectConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="w-25" onClick={closeRejectConfirmation}>
            No
          </Button>
          <Button variant="primary" className="w-25" onClick={rejectClaim}>
            Yes
          </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={confirmationPayout} onHide={closePayoutConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="w-25" onClick={closePayoutConfirmation}>
            No
          </Button>
          <Button variant="primary" className="w-25" onClick={payoutClaim}>
            Yes
          </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={approveForm} onHide={closeApproveForm}>
        <Modal.Header closeButton>
        <Modal.Title>Payment Amounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="quoteForm.Carear">
          <Row className="mb-3">
            <Form.Group as={Col} controlId="BodilyInjury">
              <Form.Label>Bodily Injury</Form.Label>
              <Form.Control 
                type="number" 
                onChange={e => setField('BodilyInjuryLiability', e.target.value)}/>
            </Form.Group>

            <Form.Group as={Col} controlId="PropertyDamage">
              <Form.Label>Property Damage</Form.Label>
              <Form.Control
                type="number" 
                onChange={e => setField('PropertyDamageLiability', e.target.value)}/>
            </Form.Group>

            <Form.Group as={Col} controlId="Collision">
              <Form.Label>Collision</Form.Label>
              <Form.Control
                type="number"  
                onChange={e => setField('Collision', e.target.value)}/>
            </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Comprehensive">
                <Form.Label>Comprehensive</Form.Label>
                <Form.Control
                  type="number"  
                  onChange={e => setField('Comprehensive', e.target.value)}/>
              </Form.Group>

              <Form.Group as={Col} controlId="PersonalInjury">
                <Form.Label>Personal Injury</Form.Label>
                <Form.Control
                  type="number"  
                  onChange={e => setField('PersonalInjuryProtection', e.target.value)}/>
              </Form.Group>

              <Form.Group as={Col} controlId="UnderinsuredMotorist">
                <Form.Label>Underinsured</Form.Label>
                <Form.Control
                  type="number"  
                  onChange={e => setField('UnderinsuredMotorist', e.target.value)}/>
              </Form.Group>
            </Row>
          </Form.Group>
        </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={closeApproveForm}>
            Close
          </Button>
          <Button variant="primary" onClick={approveClaim}>
            Approve
          </Button>
          </Modal.Footer>
        </Modal>
    <div bg="light">
          {claims.length === 0 ? 
          "No Claims to Display" : 
          <Row xs={1}>
            {claims.map((claim, i) => (
              <Col key={i}>
              <Card bg="light" className="h-100">
              <Card.Header>
                {`State: ${selectStatus(claim.State)}`}
              </Card.Header>

                <Card.Body id={i}>
                  {`Polcicy No: ${claim.PolicyNo}`}
                  <Card.Text id={i}>
                    <ListGroup>
                      <ListGroup.Item>{claim.Description.replace(/['"]+/g, '')}</ListGroup.Item>
                    </ListGroup>
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="mt-auto" style={{ display: "flex", height: "3rem" }}>
                <div className="col text-center">
                    {(props.user === "adjuster" 
                    && claim.State === "PENDING") ?
                    <>
                    <Button variant="primary"
                      className="w-25"
                      size="sm"
                      id={i}
                      style={{ marginLeft: "auto" }}
                      onClick={(e) => {openApproveForm(i)}}>
                      Approve
                    </Button>
                    <Button variant="danger"
                      className="w-25"
                      size="sm"
                      id={i}
                      style={{ marginLeft: "auto" }}
                      onClick={(e) => {openRejectConfirmation(i, "reject")}}>
                      Reject
                    </Button>
                    </>
                    :
                    (props.user === "bookkeeper") 
                    && claim.State === "ACCEPTED" ? 
                    <>
                    <Button variant="danger"
                      className="w-25"
                      size="sm"
                      id={i}
                      style={{ marginLeft: "auto" }}
                      onClick={(e) => {openPayoutConfirmation(i, "pay")}}>
                      Pay Out
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



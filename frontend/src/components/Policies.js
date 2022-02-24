import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const Policy = (props) => {
  const [modalData, setModalData] = useState({show: false});

  async function selectOffer(event) {

  }

  function handleModal(event) {
      setModalData({show: true, ...props.Offers[event.target.id]});
  }

  return (
    <div className='containerReact'>
    <div className="w-75 mt-4 mb-4" bg="light">
          <h1>Policies</h1>
          <Row xs={1} md={2} xl={4} className="g-4">
                  <Col key={1} >
                  <Card bg="light" className="h-100">
                      <Card.Header>
                        <>Status: Active 🟢</>
                      </Card.Header>
                      <button className="btn" id={1} onClick={handleModal}>
                          <Card.Body id={1}>
                              <Card.Title id={1}>
                                  Company A
                              </Card.Title>
                              <Card.Text id={1} >
                                <ListGroup>
                                  <ListGroup.Item>✅ Bodily Injury: $99.999</ListGroup.Item>
                                </ListGroup>
                              </Card.Text>
                              <Card.Text id={1} style={{fontWeight: 'bold'}}>
                                  Click to see policy details
                              </Card.Text>
                          </Card.Body>
                      </button>
                      <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="primary" id={3} 
                                  style={{ marginLeft: "auto" }}
                                  onClick={(e) => {selectOffer(e)}}>
                              Add Claim
                          </Button>
                      </Card.Footer>
                  </Card>
                  </Col>

                  <Col key={2} >
                  <Card bg="light" className="h-100">
                      <Card.Header>
                        <>Status: Suspended 🟡</>
                      </Card.Header>
                      <button className="btn" id={2} onClick={handleModal}>
                          <Card.Body id={2}>
                              <Card.Title id={2}>
                                  Company B
                              </Card.Title>
                                <ListGroup>
                                  <ListGroup.Item>✅ Bodily Injury: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Property Damage: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Collision: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Comprehensive: $99.999</ListGroup.Item> 
                                  <ListGroup.Item>❌ Personal Injury</ListGroup.Item>
                                  <ListGroup.Item>❌ Underinsured Motorist</ListGroup.Item>
                                </ListGroup>
                              <Card.Text id={2} style={{fontWeight: 'bold'}}>
                                  Click to see policy details
                              </Card.Text>
                          </Card.Body>
                      </button>
                      <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="secondary" id={3} 
                                  style={{ marginLeft: "auto" }}
                                  onClick={(e) => {selectOffer(e)}}
                                  disabled>
                              Add Claim
                          </Button>
                      </Card.Footer>
                  </Card>
                  </Col>

                  <Col key={3} >
                  <Card bg="light" className="h-100">
                      <Card.Header>
                        <>Status: Pending ⚪</>
                      </Card.Header>
                      <button className="btn" id={3} onClick={handleModal}>
                          <Card.Body id={3}>
                              <Card.Title id={3}>
                                  Company C
                              </Card.Title>
                              <Card.Text id={3}>
                                <ListGroup>
                                  <ListGroup.Item>✅ Bodily Injury: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Property Damage: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Collision: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Comprehensive: $99.999</ListGroup.Item> 
                                  <ListGroup.Item>❌ Personal Injury</ListGroup.Item>
                                  <ListGroup.Item>❌ Underinsured Motorist</ListGroup.Item>
                                </ListGroup>
                              </Card.Text>
                              <Card.Text id={3} style={{fontWeight: 'bold'}}>
                                  Click to see policy details
                              </Card.Text>
                          </Card.Body>
                      </button>
                      <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="secondary" id={3} 
                                  style={{ marginLeft: "auto" }}
                                  onClick={(e) => {selectOffer(e)}}
                                  disabled>
                              Add Claim
                          </Button>
                      </Card.Footer>
                  </Card>
                  </Col>

                  <Col key={4} >
                  <Card bg="light" className="h-100">
                      <Card.Header>
                        <>Status: Expired 🔴</>
                      </Card.Header>
                      <button className="btn" id={4} onClick={handleModal}>
                          <Card.Body id={4}>
                              <Card.Title id={4}>
                                  Company C
                              </Card.Title>
                              <Card.Text id={4}>
                                <ListGroup>
                                  <ListGroup.Item>✅ Bodily Injury: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Property Damage: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Collision: $99.999</ListGroup.Item>
                                  <ListGroup.Item>✅ Comprehensive: $99.999</ListGroup.Item> 
                                  <ListGroup.Item>❌ Personal Injury</ListGroup.Item>
                                  <ListGroup.Item>❌ Underinsured Motorist</ListGroup.Item>
                                </ListGroup>
                              </Card.Text>
                              <Card.Text id={4} style={{fontWeight: 'bold'}}>
                                  Click to see policy details
                              </Card.Text>
                          </Card.Body>
                      </button>
                      <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="secondary" id={4} 
                                  style={{ marginLeft: "auto" }}
                                  onClick={(e) => {selectOffer(e)}}
                                  disabled>
                              Add Claim
                          </Button>
                      </Card.Footer>
                  </Card>
                  </Col>
          </Row>
    </div>
    </div>
  );
};

export default Policy;
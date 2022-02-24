import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const Claim = (props) => {
  const [modalData, setModalData] = useState({show: false});

  async function selectOffer(event) {

  }

  function handleModal(event) {
      
  }

  return (
    <div className='containerReact'>
    <div className="w-75 mt-4 mb-4" bg="light">
            <h1>Claims</h1>
            <Row xs={1} md={2} xl={4} className="g-4">
                    <Col key={1} >
                    <Card bg="light" className="h-100">
                        <Card.Header>
                          <>Status: Completed 🟢</>
                        </Card.Header>
                        <button className="btn" id={1} onClick={handleModal}>
                            <Card.Body id={1}>
                                <Card.Title id={1}>
                                    Claim No: 999.999.999
                                </Card.Title>
                                <Card.Text id={1} >
                                  <ListGroup>
                                    <ListGroup.Item>Policy Id: 999.999.999</ListGroup.Item>
                                    <ListGroup.Item>Amount: $99.999</ListGroup.Item>
                                  </ListGroup>
                                </Card.Text>
                                <Card.Text id={1} style={{fontWeight: 'bold'}}>
                                    Click to see claim details
                                </Card.Text>
                            </Card.Body>
                        </button>
                        <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="secondary" id={3} 
                                      style={{ marginLeft: "auto" }}
                                      onClick={(e) => {selectOffer(e)}}
                                      disabled>
                                  Update Claim
                          </Button>
                        </Card.Footer>
                    </Card>
                    </Col>

                    <Col key={2} >
                    <Card bg="light" className="h-100">
                        <Card.Header>
                          <>Status: Accepted 🟡</>
                        </Card.Header>
                        <button className="btn" id={2} onClick={handleModal}>
                            <Card.Body id={2}>
                                <Card.Title id={2}>
                                  Claim No: 999.999.999
                                </Card.Title>
                                  <ListGroup>
                                    <ListGroup.Item>Policy Id: 999.999.999</ListGroup.Item>
                                    <ListGroup.Item>Amount: $99.999</ListGroup.Item>
                                  </ListGroup>
                                <Card.Text id={2} style={{fontWeight: 'bold'}}>
                                    Click to see claim details
                                </Card.Text>
                            </Card.Body>
                        </button>
                        <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="secondary" id={3} 
                                      style={{ marginLeft: "auto" }}
                                      onClick={(e) => {selectOffer(e)}}
                                      disabled>
                                  Update Claim
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
                                  Claim No: 999.999.999
                                </Card.Title>
                                <Card.Text id={3}>
                                  <ListGroup>
                                    <ListGroup.Item>Policy Id: 999.999.999</ListGroup.Item>
                                    <ListGroup.Item>Amount: $99.999</ListGroup.Item>
                                  </ListGroup>
                                </Card.Text>
                                <Card.Text id={3} style={{fontWeight: 'bold'}}>
                                    Click to see claim details
                                </Card.Text>
                            </Card.Body>
                        </button>
                        <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                            <Button variant="primary" id={3} 
                                    style={{ marginLeft: "auto" }}
                                    onClick={(e) => {selectOffer(e)}}
                                    >
                                Update Claim
                            </Button>
                        </Card.Footer>
                    </Card>
                    </Col>

                    <Col key={4} >
                    <Card bg="light" className="h-100">
                        <Card.Header>
                          <>Status: Rejected 🔴</>
                        </Card.Header>
                        <button className="btn" id={4} onClick={handleModal}>
                            <Card.Body id={4}>
                                <Card.Title id={4}>
                                  Claim No: 999.999.999
                                </Card.Title>
                                <Card.Text id={4}>
                                  <ListGroup>
                                    <ListGroup.Item>Policy Id: 999.999.999</ListGroup.Item>
                                    <ListGroup.Item>Amount: $99.999</ListGroup.Item>
                                  </ListGroup>
                                </Card.Text>
                                <Card.Text id={4} style={{fontWeight: 'bold'}}>
                                    Click to see claim details
                                </Card.Text>
                            </Card.Body>
                        </button>
                        <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                          <Button variant="secondary" id={3} 
                                      style={{ marginLeft: "auto" }}
                                      onClick={(e) => {selectOffer(e)}}
                                      disabled>
                                  Update Claim
                            </Button>
                        </Card.Footer>
                    </Card>
                    </Col>
            </Row>
    </div>
    </div>
  );
};

export default Claim;
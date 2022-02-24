import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Axios from 'axios';

const popover = () => {
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
};

// maintains the main grid of the Offers based on current user
export default function Offers(props) {
    const [modalData, setModalData] = useState({show: false});

    function handleModal(event) {
        setModalData({show: true, ...props.Offers[event.target.id]});
    }

    return (
        <div className='containerReact'>
            <div className="w-75 mt-4 mb-4" bg="light">
                <h1>Offers</h1>
                <div className="w-75 mt-4 mb-4" bg="light">
                    {props.offers.length === 0 ? 
                    "" : 
                    <Row xs={1} md={2} xl={4} className="g-4">
                        {props.offers.map((offer, i) => (
                            <Col key={i*100 +i}>
                            {!offer.selected && props.offers.some(offer => offer.selected) ? "" :
                            <Card bg="light" className="h-100">
                            <Card.Header>
                                {`Option ${offer.offerId}`}
                            </Card.Header>
                                <OverlayTrigger trigger="click" placement="top" overlay={
                                    <Popover id="popover-basic">
                                        <Popover.Header as="h3">Offer Details</Popover.Header>
                                        <Popover.Body>
                                            {offer.offer_details}
                                        </Popover.Body>
                                    </Popover>
                                }>                                        
                                <button className="btn" id={i} onClick={handleModal}>
                                    <Card.Body id={i}>
                                        <Card.Text id={i}>
                                            <ListGroup>
                                                {Object.values(offer.Coverage).map((cover) => (
                                                    <ListGroup.Item className="d-flex">{`${cover.Active? '✅': '❌'} ${cover.Name} ${cover.CoveredAmount == 0 ? "" : `$ ${cover.CoveredAmount}`}`}</ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Card.Text>
                                        <Card.Text id={i} style={{fontWeight: 'bold'}}>
                                            Click to see policy details
                                        </Card.Text>
                                    </Card.Body>
                                </button>
                                </OverlayTrigger>
                                <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                                    <h3>{`Total: $ ${offer.price}`}</h3>
                                    <Button variant="outline-dark" 
                                            id={offer.offerId}
                                            style={{ marginLeft: "auto" }}
                                            onClick={(e) => {props.selectOffer(e)}}>
                                        Accept
                                    </Button>
                                </Card.Footer>
                            </Card>}
                            </Col>
                        ))}
                    </Row>}
                </div>
            </div>
        </div>
    )
}



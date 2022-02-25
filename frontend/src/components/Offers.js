import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { urlContext } from './urlContext';
import Axios from 'axios';

// maintains the main grid of the Offers based on current user
export default function Offers(props) {
  const url = React.useContext(urlContext);

  function pay(){
    console.log(props.policyNo)
    Axios.get(`${url}/makePayment?policyNo=${props.policyNo}`)
    .then((res)=>{
      console.log(res.data)
      //if SUCESS hide pay
      //Map offer 
    });
  }

  return (
    <div className='containerReact'>
      <div className="w-75 mt-4 mb-4" bg="light">
        <h1>Offers</h1>
        <div className="w-75 mt-4 mb-4" bg="light">
          {props.offers.length === 0 ? 
          "" : 
          <Row xs={1} md={2} className="g-4">
            {props.offers.map((offer, i) => (
              <Col key={i}>
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
                  
                <Card.Body id={i}>
                  <Card.Text id={i}>
                    <ListGroup>
                      {Object.keys(offer.Coverage).map((type) => (
                        <ListGroup.Item className="d-flex">
                          {`${offer.Coverage[type].Active? '✅': '❌'} 
                          ${type.replace(/([a-z])([A-Z])/g, "$1 $2")}
                          ${offer.Coverage[type].CoveredAmount == 0 ? "" : `$${offer.Coverage[type].CoveredAmount}`}`}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Text>
                  <Card.Text id={i} style={{fontWeight: 'bold'}}>
                    Click to see policy details
                  </Card.Text>
                </Card.Body>
                  
                </OverlayTrigger>
                <Card.Footer className="mt-auto" style={{ display: "flex" }}>
                  <h3>{`Price: $ ${offer.price}`}</h3>
                  {offer.selected ?
                  <Button
                    variant="outline-dark" 
                    id={offer.offerId}
                    style={{ marginLeft: "auto" }}
                    onClick={(e) => {pay()}}>
                    Pay
                  </Button> :
                  <Button
                    id={offer.offerId}
                    style={{ marginLeft: "auto" }}
                    onClick={(e) => {props.selectOffer(e)}}>
                    Accept
                  </Button>
                  }
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



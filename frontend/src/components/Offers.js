import React, {useEffect} from 'react';
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

  useEffect(()=>{
    console.log("OFFERS RECEIVED: ", props.offers)
  },[props.offers])

  function pay(i){
    console.log(props.policyNo)
    Axios.get(`${url}/makePayment?policyNo=${props.policyNo}`)
    .then((res)=>{
      if(res.data === "SUCCESS"){
        let offers_ = [...props.offers];
        offers_[i].paid = true;
        props.setOffers(offers_);
      } 
      console.log(props.offers);
    });
  }

  return (
    <div className='containerReact'>
      <div className="mt-4" bg="light">
        
        <div bg="light">
          {props.offers.length === 0 ? 
          "" : 
          <>
          <h1>Offers</h1>
          <Row xs="auto" >
            {props.offers.map((offer, i) => (
              <Col key={i}>
              {!offer.selected && props.offers.some(offer => offer.selected) ? "" :
              <Card bg="light" className="h-100">
              <Card.Header>
                {`Offer ID: ${offer.offerId}`}
              </Card.Header>
                <OverlayTrigger trigger="click" placement="top" overlay={
                  <Popover id="popover-basic">
                    <Popover.Header as="h3">Offer Details</Popover.Header>
                    <Popover.Body>
                      This is a mock up offer, there's no details.
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
                          ${offer.Coverage[type].CoveredAmount === 0 ? "" : `$${offer.Coverage[type].CoveredAmount}`}`}
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
                  <b>{`Price: $ ${offer.price}`}</b>
                  {offer.selected && !offer.paid ?
                  <Button
                    variant="outline-dark"
                    className="w-25"
                    size="sm"
                    id={offer.offerId}
                    style={{ marginLeft: "auto" }}
                    onClick={(e) => {pay(i)}}>
                    Pay
                  </Button> :
                  offer.selected && offer.paid ?
                  "" :
                  <Button
                    id={offer.offerId}
                    className="w-25"
                    size="sm"
                    style={{ marginLeft: "auto" }}
                    onClick={(e) => {props.selectOffer(e)}}>
                    Accept
                  </Button>
                  }
                </Card.Footer>
              </Card>}
              </Col>
            ))}
          </Row>
          </>}
        </div>
      </div>
    </div>
    
  )
}



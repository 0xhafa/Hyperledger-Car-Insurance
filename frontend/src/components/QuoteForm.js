import React, {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import newId from '../utils/newId';
import { urlContext } from './urlContext';

// maintains the registration form for new initatives
export default function QuoteForm(props) {
    const url = React.useContext(urlContext);
    const [data, setData] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        driversLicenseNo: "",
        carModel: "",
        carLicensePlate: "",
        carYear: ""
    })

    const setField = (field, value) => {
        setData(form => ({...form, [field]: value}));
        return;
    }



    const submitQuote = event => {
        event.preventDefault();
        Axios.post(`${url}/getOffers`, {
            ...data,
            userId: props.user
        }).then((res) => {
            props.setOffers(res.data);
        })
    }

    return (
        <div className='formReact'>
        <Card 
            style={{ width: '36rem' }}
            className="m-auto align-self-center"
        >
            <Card.Header>Get Quote</Card.Header>
            <Card.Body>
                <Form onSubmit={(event)=> submitQuote(event)}>
                    <Form.Group className="mb-3" controlId="quoteForm.Name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="First name" 
                            onChange={e => setField('firstName', e.target.value)}
                        />
                        <Form.Control 
                            type="text" 
                            placeholder="Last name" 
                            onChange={e => setField('lastName', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.License">
                        <Form.Label>Driver License</Form.Label>
                        <Form.Control 
                            type="int" 
                            placeholder="License number" 
                            onChange={e => setField('driversLicenseNo', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.Carmodel">
                        <Form.Label>Car Model</Form.Label>
                        <Form.Control  
                            type="int"
                            placeholder="Car model" 
                            onChange={e => setField('carModel', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.Carplate">
                        <Form.Label>Car Plate</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Car plate" 
                            onChange={e => setField('carLicensePlate', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.Caryear">
                        <Form.Label>Car Year</Form.Label>
                        <Form.Control  
                            type="int" 
                            placeholder="Car year" 
                            onChange={e => setField('carYear', e.target.value)}
                        />
                    </Form.Group>
                    <div className="horizontal-center">
                    { props.user == "customer1" || props.user == "customer2" ?
                    <Button type="submit">Submit</Button> : "" }
                    </div>
                </Form>
            </Card.Body>
        </Card>
        </div>
    )
}

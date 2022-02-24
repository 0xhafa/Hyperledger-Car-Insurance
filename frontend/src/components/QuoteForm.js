import React, {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import newId from '../utils/newId';

// maintains the registration form for new initatives
export default function QuoteForm(props) {
    const url = "http://localhost:3001/quote"
    const [data, setData] = useState({
        name: "",
        phone: "",
        email: "",
        description: ""
    })

    const setField = (field, value) => {
        setData(form => ({...form, [field]: value}));
        return;
    }

    const submitQuote = event => {
        event.preventDefault();
        console.log(data);
        Axios.post(url, {
            id: newId(),
            name: data.name,
            phone: data.phone,
            email: data.email,
            description: data.description
        }).then((res) => {
            console.log(res)
        })
    }

    return (
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
                            placeholder="Your name" 
                            onChange={e => setField('name', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.Phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="(000) 000-0000" 
                            onChange={e => setField('phone', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.Email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="name@example.com" 
                            onChange={e => setField('email', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quoteForm.TextArea">
                        <Form.Label>Description</Form.Label>
                        <Form.Control  
                            type="text" 
                            as="textarea" rows={3} 
                            onChange={e => setField('description', e.target.value)}
                        />
                    </Form.Group>
                    { props.user == "Customer" ?
                    <Button type="submit">Submit</Button> : "" }
                </Form>
            </Card.Body>
        </Card>
    )
}

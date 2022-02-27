import React, {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
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
			//console.log(res.data)
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
				<InputGroup className="mb-3">
					<InputGroup.Text className="w-25">Name</InputGroup.Text>
					<FormControl aria-label="First name"  
						placeholder="First" 
						onChange={e => setField('firstName', e.target.value)}/>
					<FormControl aria-label="Last name" 
						placeholder="Last" 
						onChange={e => setField('lastName', e.target.value)}/>
				</InputGroup>

				<InputGroup className="mb-3">
					<InputGroup.Text className="w-25">Driver License</InputGroup.Text>
					<FormControl aria-label="First name"  
						placeholder="License number" 
						onChange={e => setField('driversLicenseNo', e.target.value)}/>
				</InputGroup>

				<InputGroup className="mb-3">
					<InputGroup.Text className="w-25">Car Model</InputGroup.Text>
					<FormControl aria-label="First name"  
						placeholder="Car model" 
						onChange={e => setField('carModel', e.target.value)}/>
				</InputGroup>

				<InputGroup className="mb-3">
					<InputGroup.Text className="w-25">Car Plate</InputGroup.Text>
					<FormControl aria-label="First name"  
						placeholder="Car plate" 
						onChange={e => setField('carLicensePlate', e.target.value)}/>
				</InputGroup>

				<InputGroup className="mb-3">
					<InputGroup.Text className="w-25">Car Year</InputGroup.Text>
					<FormControl aria-label="First name" 
						type="number"
						placeholder="Car year" 
						onChange={e => setField('carYear', e.target.value)}/>
				</InputGroup>

				<div className="horizontal-center">
				{ props.user === "customer1" || props.user === "customer2" ?
				<Button type="submit">Submit</Button> : "" }
				</div>
			</Form>
		</Card.Body>
	</Card>
	</div>
	)
}

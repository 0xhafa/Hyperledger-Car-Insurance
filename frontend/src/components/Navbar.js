import React from 'react';
import {Navbar as NavbarReact} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import logo from '../img/InsuranceMini-noBg.png';

// maintains navigation bar based on current phase
export default function Navbar(props) {
	return (
	<NavbarReact bg="light">
	<Container>
		<NavbarReact.Brand href="#">
				<img src={logo} className="me-4 d-inline-block align-center" />
    </NavbarReact.Brand>
		<NavbarReact.Toggle aria-controls="basic-navbar-nav" width={70}/>
		<NavbarReact.Collapse id="basic-navbar-nav">
			<Nav className="m-auto">
				<Nav.Link href="quotes">Quote</Nav.Link>
				<Nav.Link href="policies">Policies</Nav.Link>
				<Nav.Link href="claims">Claims</Nav.Link>
			</Nav>
		</NavbarReact.Collapse>
	</Container>
	</NavbarReact>
)
}
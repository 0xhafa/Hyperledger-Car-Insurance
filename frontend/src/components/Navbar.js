import React from 'react';
import {Navbar as NavbarReact} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import logo from '../logo64.png';

// maintains navigation bar based on current phase
export default function Navbar(props) {
    return (
        <NavbarReact bg="light">
        <Container>
            <NavbarReact.Toggle aria-controls="basic-navbar-nav" />
            <NavbarReact.Collapse id="basic-navbar-nav">
                <Nav className="m-auto">
                    <Nav.Link href="quotes">Quote</Nav.Link>
                    <Nav.Link href="policies">Policy</Nav.Link>
                    <Nav.Link href="claims">Claim</Nav.Link>
                </Nav>
            </NavbarReact.Collapse>
        </Container>
        </NavbarReact>
    )
}
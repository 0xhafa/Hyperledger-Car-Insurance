import React from 'react';
import {Navbar as NavbarReact} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import logo from '../logo64.png';

// maintains navigation bar based on current phase
export default function Navbar(props) {
    return (
        <NavbarReact bg="light" expand="lg">
        <Container>
            <NavbarReact.Brand href="#">
                <img src={logo} className="me-4 d-inline-block align-center" alt="Project logo"/>
                Hyperledger Car Insurance
            </NavbarReact.Brand>

            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select User Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item href="#/customer">Customer</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Insurance</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Authority</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>

            <NavbarReact.Toggle aria-controls="basic-navbar-nav" />
            <NavbarReact.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#quotation">Quote</Nav.Link>
                    <Nav.Link href="#policies">Policy</Nav.Link>
                    <Nav.Link href="#claim">Claim</Nav.Link>
                </Nav>
            </NavbarReact.Collapse>
        </Container>
        </NavbarReact>
    )
}
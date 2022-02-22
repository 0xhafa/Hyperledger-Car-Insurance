import React from 'react'
import Modal from 'react-bootstrap/Modal';

// maintains initiative modal when long description present in a grid
export default function Initiative(props) {
    return (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.data.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.data.description}</p>
                {props.data.website !== '' ? 
                    <p>{`Visit the website: `}
                    <a target="_blank" href={`https://${props.data.website}`}>{props.data.website}</a>
                    </p> : ''}
            </Modal.Body>
        </Modal>
    );
}
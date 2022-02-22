import {useWeb3React} from "@web3-react/core";
import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ReactLoading from "react-loading";
import Initiative from "./Policy";

// maintains the main grid of the initiatives based on current phase
export default function Initiatives(props) {
    const {active, account} = useWeb3React();
    const [modalData, setModalData] = useState({show: false});

    async function voteForInitiative(event) {
        if(!(active && props.contract)) {
            alert("Connect wallet first");
            return;
        }
        await props.contract.vote(event.target.id).catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
    }

    async function payoutProject(event) {
        if(!(active && props.contract)) {
            alert("Connect wallet first");
            return;
        }
        await props.contract.payoutProject(parseInt(props.state.currentRound), event.target.id).catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
    }    

    function handleModal(event) {
        setModalData({show: true, ...props.initiatives[event.target.id]});
    }

    return (
        <div className="w-75 mt-4 mb-4" bg="light">
            {props.initiatives.length === 0 ? 
            <div className="mt-5 d-flex justify-content-center align-items-center" >
                <ReactLoading type="spin" color="black" height="10vh" width="10vh" />
            </div> : 
            <Row xs={1} md={2} xl={4} className="g-4">
                {props.initiatives.map((initiative, i) => (
                    <Col key={initiative.hash} >
                    <Card bg="light" className="h-100">
                        <Card.Img variant="top" 
                                  style={{"height": "15vw", "objectFit": "cover"}} 
                                  src={`https://gateway.ipfs.io/ipfs/${initiative.imageHash}`} />

                        <button className="btn" id={i} onClick={handleModal}>
                            <Card.Body id={i}>
                                <Card.Title id={i}>
                                    {initiative.title}
                                </Card.Title>
                                
                                <Card.Text id={i}>
                                    {initiative.description.length <= 150 ? 
                                        initiative.description : 
                                        initiative.description.slice(0,147)+'...'
                                    }
                                    {initiative.website !== '' ? ` Visit the website: ` : ''}
                                    {initiative.website !== '' ? <a target="_blank" href={`https://${initiative.website}`}>{initiative.website}</a> : ''}
                                </Card.Text>
                                
                                {initiative.description.length > 150 ? 
                                    <Card.Text id={i}>
                                        Click to learn more!
                                    </Card.Text> : ''}
                            </Card.Body>
                        </button>

                        <Card.Footer className="mt-auto">
                        {props.state.phase === 'fundraising' ? 
                            <>
                                <Card.Text>
                                    {`Votes weight: ${initiative.votesWeightShare} %`}
                                </Card.Text>
                                <Button variant="outline-dark" id={initiative.hash} 
                                        onClick={(e) => {voteForInitiative(e)}}>
                                    Vote for this initiative!
                                </Button>
                            </> :
                            <>
                                <Card.Text>
                                    {`Raised: ${initiative.fundedAmount} ETH`}
                                </Card.Text>
                                <Button variant="success" id={initiative.hash} 
                                        onClick={(e) => payoutProject(e)}
                                        style={{"visibility": active && account.toLowerCase() === initiative.address.toLowerCase() ? "visible" : "hidden"}}>
                                    Collect money!
                                </Button>
                            </>
                        }
                        </Card.Footer>
                    </Card>
                    </Col>
                ))}
            </Row>}
            <Initiative data={modalData} show={modalData.show} onHide={() => setModalData({show: false})} />
      </div>
    )
}

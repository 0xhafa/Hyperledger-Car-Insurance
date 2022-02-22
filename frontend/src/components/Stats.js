import React from 'react';
import Button from 'react-bootstrap/Button';

// maintains contract statistics based on passed state
export default function Stats(props) {
    return (
        <div className="App-Stats w-75 m-auto bg-light position-relative" id="stats">
            <header className="App-Center border-1 border-end border-start" style={{"borderColor": "rgba(0,0,0,.125)"}}>
                <h1 className="m-5 fw-bold">Our numbers</h1>
                <h4>Raised to date</h4>
                <p>{props.state.totalContribution ? `${props.state.totalContribution} ETH` : ''}</p>
                <h4>Number of initiatives funded</h4>
                <p>{props.state.numberOfFunded ? props.state.numberOfFunded : ''}</p>
            </header>

            <div className="App-Center position-absolute start-50 translate-middle" style={{bottom: "10%"}}>
                <h2 className="fw-bold mb-3">
                    {props.state.phase === 'registration' ? "Register your initiative today!" : 
                     props.state.phase === 'fundraising'  ? "Contribute today!" : 
                                                            "Check out recently funded initiatives!"
                    }
                </h2>
                <a href="#dApp">
                    <Button variant="outline-dark" type="submit">Scroll down</Button>
                </a>
            </div>
        </div>
    )
}

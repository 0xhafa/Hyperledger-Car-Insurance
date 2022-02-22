import React, {useState} from 'react'
import {useWeb3React} from "@web3-react/core";
import {ethers} from 'ethers';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// maintains the contribution form
export default function Contribution(props) {
    const [value, setValue] = useState('0');
    const {active} = useWeb3React();

    async function handleContribute(event) {
        event.preventDefault();
        if(!(active && props.contract)) {
            alert("Connect wallet first");
            return;
        }

        let parsed = parseFloat(value);
        if(!parsed || parsed <= 0) {
            alert("Contribution must be greater than 0 ETH");
            return;
        }

        await props.contract.buyCredits({value: ethers.utils.parseEther(value)}).catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });
        setValue('0');
    }

    return (
        <div>
            <Form onSubmit={handleContribute}>
                <Form.Group className="mb-3" controlId="value">
                    <Form.Label>How much ETH would you like to contribute?</Form.Label>
                    <Form.Control type="text" required 
                                  value={value} onChange={e => setValue(e.target.value)} />
                </Form.Group>
                
                <Button variant="success" type="submit">
                    Contribute!
                </Button>
            </Form>
        </div>
    )
}

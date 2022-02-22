import React, {useState} from 'react'
import {useWeb3React} from "@web3-react/core";
import {create} from "ipfs-http-client";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const IPFS_URL = 'https://ipfs.infura.io:5001';

// maintains the registration form for new initatives
export default function Registation(props) {
    const clearForm = {title: '', description: '', website: '', address: ''};
    const {active, account} = useWeb3React();
    const [form, setForm] = useState(clearForm);
    const [image, setImage] = useState();
    const [fileInput, setFileInput] = useState();

    const setField = (field, value) => {
        if(field !== 'address' && form.address === '' && active) {
            setForm(form => ({...form, address: account, [field]: value}));
            return;
        }

        setForm(form => ({...form, [field]: value}));
    }

    const handleImage = event => {
        if (event.target.files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(event.target.files[0],'UTF-8');
        
            reader.onload = readerEvent => {
                setImage(readerEvent.target.result);
            }
            setFileInput(event.target);
        }
    }

    const registerInitiative = async event => {
        event.preventDefault();
        if(!(active && props.contract)) {
            alert("Connect wallet first");
            return;
        }

        const ipfs = create(IPFS_URL);
        let result = await ipfs.add(image);
        result = await ipfs.add({path: '/', content: JSON.stringify({...form, imageHash: result.path})});
        
        await props.contract.registerProject(result.path, form.address).catch(error => {
            alert(`Something went wrong:\n${error.message}`);
        });

        fileInput.value = '';
        setForm(clearForm);
        setImage();
        setFileInput();
    }

    return (
        <div className="w-50">
            <p className="mt-4 mb-3">Register an initiative that later on will be funded.</p>
            <Form onSubmit={registerInitiative}>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Initiative title</Form.Label>
                    <Form.Control 
                        type="text" 
                        required
                        placeholder="The best initiative."
                        value={form.title}
                        onChange={e => setField('title', e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Initiative description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        required 
                        placeholder="Explain what you are raising for."
                        value={form.description}
                        onChange={e => setField('description', e.target.value)}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="website">
                    <Form.Label>Initiative's website</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="www.myinitiative.ca"
                        value={form.website}
                        onChange={e => setField('website', e.target.value)}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="image">
                    <Form.Label>Initiative's image</Form.Label>
                    <Form.Control
                        type="file"
                        required
                        name="image"
                        accept="image/png, image/jpeg"
                        onChange={handleImage}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Ethereum address</Form.Label>
                    <Form.Control 
                        type="text" 
                        required
                        placeholder={`0x${'1234'.repeat(5)}`}
                        value={form.address}
                        onChange={e => setField('address', e.target.value)}
                    />
                    <Form.Text className="text-muted">Will be needed to collect raised funds.</Form.Text>
                </Form.Group>
                
                <Button variant="outline-dark" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'

export default function User() {
    const [user, setUser] = useState("Customer 1")

    const handleUser = (e) => {
        /////////////////TRIGGER GETPOLICIES
        setUser(e.target.value); 
    }

    return (
        <Form.Select onChange = { handleUser } value={ user } size="sm" >
            <option disabled>Select User Type</option>
            <option value="customer1">Customer 1</option>
            <option value="customer2">Customer 2</option>
            <option value="worker">Insurance Worker</option>
            <option value="manager">Insurance Manager</option>
            <option value="adjuster">Insurance Adjuster</option>
            <option value="bookkeeper">Bookkeeper</option>
            <option value="reader">Authority</option>
        </Form.Select>
    )
}
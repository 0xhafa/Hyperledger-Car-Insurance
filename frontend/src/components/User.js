import React, {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form'

export default function User() {
    const [user, setUser] = useState("Customer 1")

    const handleUser = (e) => {
        setUser(e.target.value); 
    }

    return (
        <Form.Select onChange = { handleUser } value={ user } size="sm" >
            <option disabled>Select User Type</option>
            <option value="Customer 1">Customer 1</option>
            <option value="Customer 2">Customer 2</option>
            <option value="InsuranceWorker">Insurance Worker</option>
            <option value="InsuranceManager">Insurance Manager</option>
            <option value="Authority">Authority</option>
        </Form.Select>
    )
}
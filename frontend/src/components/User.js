import React, {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form'

export default function User() {
    const [user, setUser] = useState("Customer")
/*
    useEffect(() => {
        setUser(JSON.parse(window.localStorage.getItem('user')));
    },[])

    useEffect(() => {
        window.localStorage.setItem('user', JSON.stringify(user));
    }, [user])
*/
    const handleUser = (e) => {
        setUser(e.target.value); 
    }

    return (
        <Form.Select onChange = { handleUser } value={ user } size="sm" >
            <option disabled>Select User Type</option>
            <option value="Customer">Customer</option>
            <option value="InsuranceWorker">Insurance Worker</option>
            <option value="InsuranceManager">Insurance Manager</option>
            <option value="Authority">Authority</option>
        </Form.Select>
    )
}
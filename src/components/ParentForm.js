import { useRef, useState } from 'react';

import Form from './Form';

const ParentForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const onFormSubmit = () => {
        console.log("WOO Form submitted succesfully");
    }

    return (
        <Form 
            onFormSubmit={onFormSubmit}
            classNames={['parent__form']}
        >
            <label htmlFor='firstName'>First Name: </label>
            <input 
                id='firstName' 
                type='text' 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />

            <label htmlFor='lastName'>Last Name: </label>
            <input 
                id='lastName' 
                type='text' 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} 
            />

            <label htmlFor='email'>Email: </label>
            <input 
                id='email' 
                type='text' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
            >
                Submit
            </button>
        </Form>
    )
}

export default ParentForm;
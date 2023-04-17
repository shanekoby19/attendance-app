import React, { useState } from 'react';
import validator from 'validator';

import Loader from '../Loader/Loader';
import Error from '../Error/Error';

import './styles/Form.scss';

const Form = ({ children, onFormSubmit, style, classNames }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    console.log("Error is: ", error);

    const inputsAreValid = (e) => {
        const errorElement = Array.from(e.target).find(element => {
            // Check to see the element is an input element.
            if(element.nodeName === 'INPUT') {
                // Ensure a value was given.
                if(!element.value && element.type !== 'file') {
                    console.log(element);
                    setError(`The ${element.id} field is required.`);
                    return true;
                }

                // Ensure a valid email is given (must use id='email')
                if(element.id === 'email' && !validator.isEmail(element.value)) {
                    setError(`${element.value} is not a valid email address.`)
                    return true
                }

                // Ensure a valid phoneNumber is given (must use id='phone')
                if(element.id === 'phone' && !validator.isMobilePhone(element.value)) {
                    setError(`${element.value} is not a valid phone number.`)
                    return true
                }

                // Ensure a valid password is given (must use id='password')
                if(element.id === 'password' && !validator.isStrongPassword(element.value)) {
                    setError(`${element.value} is not a valid password`)
                    return true;
                }

                // Reset the border color for any inputs that have been fixed.
                if(element.style.borderColor === 'red') {
                    setError('');
                    element.style.borderColor = 'white'
                }
            }

            // Clear any errors after they have been fixed.
            setError('');
            return false;
        });
        
        if(errorElement) {
            errorElement.style.borderColor = 'red';
            return false;
        }
       
        return true;
    }

    if(loading) {
        <Loader 
            style={{
                height: "55vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
        />
    }

    return (
        <form 
            className={`form ${classNames && classNames.length > 0 ? classNames.join(' ') : ''}`}
            style={style}
            onSubmit={(e) => {
                e.preventDefault();
                if(inputsAreValid(e)) {
                    onFormSubmit();
                }
            }}>
            {children}
            {error && <Error message={error}/>}
        </form>
    )
}

export default Form;
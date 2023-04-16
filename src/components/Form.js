import React, { useState } from 'react';
import validator from 'validator';

const Form = ({ children, onFormSubmit, style, classNames }) => {
    const [error, setError] = useState('');

    const inputsAreValid = (e) => {
        const errorElement = Array.from(e.target).find(element => {
            // Check to see the element is an input element.
            if(element.nodeName === 'INPUT') {
                // Ensure a value was given.
                if(!element.value) {
                    setError(`The ${element.id} field is required.`);
                    return true;
                }

                // Ensure a valid email is given (must use id='email')
                if(element.id === 'email' && !validator.isEmail(element.value)) {
                    setError(`${element.value} is not a valid email address.`)
                    return true
                }


                // Reset the border color for any inputs that have been fixed.
                if(element.style.borderColor === 'red') {
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

    return (
        <form 
            className={`form ${classNames.join(' ')}`}
            style={style}
            onSubmit={(e) => {
                e.preventDefault();
                if(inputsAreValid(e)) {
                    onFormSubmit();
                }
            }}>
            {children}
            {error && <p>{error}</p>}
        </form>
    )
}

export default Form;
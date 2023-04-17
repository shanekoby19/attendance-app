import { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import Dropzone from '../Dropzone/Dropzone';
import Form from './Form';
import Loader from '../Loader/Loader';

import { useSetAuthUser } from '../../context/AuthContext';
import './styles/PrimaryGuardianForm.scss';


const PrimaryGuardianForm = () => {
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const setAuthUser = useSetAuthUser();

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const onFormSubmit = async () => {
        // Ensure the password and confirmPassword fields match
        if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            return setError('Your passwords do not match, please re-enter them.')
        }

        // Ensure a file was uploaded for the profile picture.
        if(!file) {
            return setError('Your profile image is required.');
        }

        // Ensure the file was a image.
        if(!file.type.includes('image')) {
            setError('The file you tried uploading is not an image.')
            return setFile(null);
        }

        // Add the user to the database.
        setLoading(true);
        const formData = new FormData();

        // Append the form data to the formData object.
        formData.append('firstName', firstNameRef.current.value)
        formData.append('lastName', lastNameRef.current.value)
        formData.append('email', emailRef.current.value)
        formData.append('phoneNumber', phoneNumberRef.current.value)
        formData.append('password', passwordRef.current.value)
        formData.append('profileImage', file);

        try {
            const response = await axios.post('http://localhost:3000/api/v1/primary-guardians', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            // Store the current user in state.
            setAuthUser(response.user);
            setLoading(false);
            setError('');
        } catch(err) {
            setError(err.message);
        };
    }

    return (
        <Form
            onFormSubmit={onFormSubmit}
        >
            <motion.section 
                className='primary__guardian__form'
                initial={{
                    y: -100,
                }}
                animate={{
                    y: 0,
                    transition: { duration: 1 }
                }}    
            >
                <h2 className='primary__guardian__form__header'>Guardian Information</h2>

                <div className='primary__guardian__form__group--section'>

                    {/* FIRST NAME INPUT */}
                    <div className='primary__guardian__form__group'>
                        <label 
                            htmlFor="firstName"
                        >First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            ref={firstNameRef}
                        ></input>
                    </div>


                    {/* LAST NAME INPUT */}
                    <div className='primary__guardian__form__group'>
                        <label 
                            htmlFor="lastName"
                        >Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            ref={lastNameRef}
                        ></input>
                    </div>
                </div>


                <div className='primary__guardian__form__group--section'>
                    {/* EMAIL INPUT */}
                    <div className='primary__guardian__form__group'>
                        <label 
                            htmlFor="email"
                        >Email</label>
                        <input
                            id="email"
                            type="email"
                            ref={emailRef}
                        ></input>
                    </div>


                    {/* PHONE INPUT */}
                    <div className='primary__guardian__form__group'>
                        <label 
                            htmlFor="phone"
                        >Phone</label>
                        <input
                            id="phone"
                            type="text"
                            ref={phoneNumberRef}
                        ></input>
                    </div>
                </div>

                <div className='primary__guardian__form__group--section'>
                    {/* PASSWORD INPUT */}
                    <div className='primary__guardian__form__group'>
                        <label 
                            htmlFor="password"
                        >Password</label>
                        <input
                            id="password"
                            type="password"
                            ref={passwordRef}
                        ></input>
                    </div>

                    {/* CONFIRM PASSWORD INPUT */}
                    <div className='primary__guardian__form__group'>
                        <label 
                            htmlFor="confirmPassword"
                        >Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            ref={confirmPasswordRef}
                        ></input>
                    </div>
                </div>



                <div className='primary__guardian__form__group--section'>
                    <Dropzone style={{color: "black"}} file={file} setFile={setFile}></Dropzone>
                </div>

                <div className='primary__guardian__form__group--section'>
                    {error && <p>{error}</p>}
                </div>

                <div>
                    {
                        loading && 
                        <Loader message="Creating your profile in the database."/>
                    }
                </div>

                <div className='primary__guardian__form__group--section' style={{ justifyContent: "space-between", width: "64%", margin: "0 auto" }}>
                    <button
                        className='primary__button'
                        style={{
                            marginTop: "2rem",
                        }}
                    >Guardians</button>
                    <button
                        className='primary__button'
                        style={{
                            marginTop: "2rem",
                        }}
                    >Children</button>
                </div>
            </motion.section>
        </Form>
    )
}

export default PrimaryGuardianForm;
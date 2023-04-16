import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import validator from 'validator';

import Dropzone from '../../Miscellaneous/components/Dropzone';
import Loader from '../../Miscellaneous/components/Loader';

import '../styles/PrimaryGuardian.scss';


const PrimaryGuardian = () => {
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const passwordRef = useRef('');
    const confirmPasswordRef = useRef('');
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const getFormDetails = () => {
        if(!firstNameRef.current.value) {
            return {
                isFilledOut: false,
                error: <p>'The first name field is required.'</p>
            }
        }
        if(!lastNameRef.current.value) {
            return {
                isFilledOut: false,
                error: <p>'The last name field is required.'</p>
            }
        }
        if(!emailRef.current.value) {
            return {
                isFilledOut: false,
                error: <p>'The email name field is required.'</p>
            }
        }
        if(!validator.isEmail(emailRef.current.value)) {
            return {
                isFilledOut: false,
                error: <p>'The email address you entered is invalid.'</p>
            }
        }
        if(!phoneRef.current.value) {
            return {
                isFilledOut: false,
                error: <p>'The phone number field is required.'</p>
            }
        }
        if(!validator.isMobilePhone(phoneRef.current.value)) {
            return {
                isFilledOut: false,
                error: <p>'The phone number you entered is invalid.'</p>
            }
        }
        if(!passwordRef.current.value) {
            return {
                isFilledOut: false,
                error: 'The password field is required.'
            }
        }
        if(!validator.isStrongPassword(passwordRef.current.value)) {
            return {
                isFilledOut: false,
                error: (
                    <div>
                        <p>'Your password must be at least 8 characters and contain all of the following:</p>
                        <ul>
                            <li>an uppercase letter</li>
                            <li>a lowercase letter</li>
                            <li>a number</li>
                            <li>a special character</li>
                        </ul>
                    </div>
                )
            }
        }
        if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            return {
                isFilledOut: false,
                error: 'Your passwords do not match.'
            }
        }
        if(!file) {
            return {
                isFilledOut: false,
                error: 'A valid photo of yourself is required.'
            }
        }
    }

    return (
        <motion.section 
            className='primary__guardian'
            initial={{
                y: -100,
            }}
            animate={{
                y: 0,
                transition: { duration: 1 }
            }}    
        >
            <h2 className='primary__guardian__header'>Guardian Information</h2>

            <div className='primary__guardian__group--section'>

                {/* FIRST NAME INPUT */}
                <div className='primary__guardian__group'>
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
                <div className='primary__guardian__group'>
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


            <div className='primary__guardian__group--section'>
                {/* EMAIL INPUT */}
                <div className='primary__guardian__group'>
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
                <div className='primary__guardian__group'>
                    <label 
                        htmlFor="phone"
                    >Phone</label>
                    <input
                        id="phone"
                        type="text"
                        ref={phoneRef}
                    ></input>
                </div>
            </div>

            <div className='primary__guardian__group--section'>
                {/* PASSWORD INPUT */}
                <div className='primary__guardian__group'>
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
                <div className='primary__guardian__group'>
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



            <div className='primary__guardian__group--section'>
                <Dropzone style={{color: "black"}} file={file} setFile={setFile}></Dropzone>
            </div>

            <div className='primary__guardian__group--section' style={{ color: "red" }}>
                { error }
            </div>

            <div className='primary__guardian__group--section' style={{ justifyContent: "space-between", width: "64%", margin: "0 auto" }}>
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
                    onClick={async () => {
                        setError('')
                        const formDetails = getFormDetails();
                        if(formDetails.isFilledOut) {
                            setLoading(true);
                            setTimeout(() => setLoading(false), 1000);
                        }
                        setError(formDetails.error);
                    }}
                >Children</button>
            </div>
        </motion.section>
    )
}

export default PrimaryGuardian;
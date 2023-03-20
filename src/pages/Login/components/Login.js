import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaKey } from 'react-icons/fa';
import axios from 'axios'

import { useAuthUser, useSetAuthUser } from '../../../context/AuthContext';

import '../styles/Login.scss';

const Login = () => {
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const controls = useAnimationControls();
    const [btnText, setBtnText] = useState('Login');
    const [err, setErr] = useState(undefined);
    const authUser = useAuthUser();
    const setAuthUser = useSetAuthUser();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if(authUser) {
            navigate('/checkin');
        }
    }, [authUser, navigate]);

    const loginUser = async () => {
        setErr(undefined);

        try {
            const res = await axios.post('http://localhost:3000/api/v1/auth/login', {
                email: usernameRef.current.value,
                password: passwordRef.current.value
            }, { withCredentials: true });
            setAuthUser(res.data.user);
            setBtnText('✓');
            await controls.start({
                width: "20%",
                borderRadius: "100%",
                transition: { duration: 0.5 }
            });
            await controls.start({
                x: "400%",
                rotate: 360,
                transition: { duration: 1 }
            });           
            navigate('/checkin')
        } catch (err) {
            setErr(err?.response?.data);
        }
    }

    return (
        <div className='login'>

            <motion.section 
                className='login__graphic'
                initial={{ 
                    y: 400,
                    opacity: 0,
                }}
                animate={{ 
                    y: 0,
                    opacity: 1,
                    transition: {
                        duration: 2,
                    }
                }}
            >
                <div
                    style={{
                        position: "relative"
                    }}
                >
                    <img 
                        className='login__graphic--image'
                        src='./images/attendance.jpg'
                        alt="Business man fills out a calendar."
                    ></img>
                    <a 
                        href="https://www.freepik.com/free-vector/businessman-planning-events-deadlines-agenda_9174355.htm#query=attendance&position=0&from_view=search&track=sph"
                        style={{
                            position: "absolute",
                            color: "black",
                            top: 0,
                            left: 0,
                        }}
                    >Image by pch.vector</a>
                </div>
            </motion.section>

            
            <motion.section 
                className='login__form'
                initial={{ 
                    y: -400,
                    opacity: 0,
                }}
                animate={{ 
                    y: -2,
                    opacity: 1,
                    transition: {
                        duration: 2,
                    }
                }}
            >
                { 
                    !authUser ?
                    <>
                        <div className='login__form__group'>
                            <label
                                htmlFor="username"
                            >Username:</label>
                            <FaUserShield className='login__form__group--icon'/>
                            <input
                                ref={usernameRef}
                                placeholder="your email address here..."
                                id="username"
                            ></input>
                        </div>

                        <div className='login__form__group'>
                            <label
                                htmlFor="password"
                            >Password:</label>
                            <FaKey className='login__form__group--icon'/>
                            <input
                                ref={passwordRef}
                                placeholder="your password here..."
                                type="password"
                                id="password"
                            ></input>
                        </div>
                    </>
                :  
                    <motion.h2
                        style={{ fontWeight: 500, fontSize: "1.2rem", marginBottom: "4rem"}}
                        initial={{ x: -100, opacity: 0, color: "#fff" }}
                        animate={{ x: 100, opacity: 1, transition: { delay: 0.3, duration: 1.2 } }}
                    >{`Welcome back ${authUser.firstName}!`}</motion.h2>}

                { 
                    err && 
                    <motion.p 
                        className='error__message'
                        style={{ width: "80%", alignSelf: "center" }}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1, transition: { duration: 1 } }}
                    >{err.message}</motion.p> 
                }

                <div className='login__form__group'>
                    <motion.button
                        initial={{
                            height: "100%",
                            width: "100%"
                        }}
                        whileHover={{
                            y: -5,
                            boxShadow: "0px 10px 20px 2px rgba(0, 0, 0, 0.3)"
                        }}
                        whileTap={{
                            y: 0,
                            boxShadow: "0px 1px 5px 1px rgba(0, 0, 0, 0.3)"
                        }}
                        animate={controls}
                        className='primary__button'
                        style={{ backgroundColor: "#33aa26", border: "none", marginTop: "1rem" }}
                        onClick={loginUser}
                    >{btnText}</motion.button>

                    <motion.button
                        initial={{
                            height: "100%",
                            width: "100%"
                        }}
                        whileHover={{
                            y: -5,
                            boxShadow: "0px 10px 20px 2px rgba(0, 0, 0, 0.3)"
                        }}
                        whileTap={{
                            y: 0,
                            boxShadow: "0px 1px 5px 1px rgba(0, 0, 0, 0.3)"
                        }}
                        animate={controls}
                        className='primary__button'
                        style={{ backgroundColor: "#f6681b", border: "none", marginTop: "1rem" }}
                        onClick={() => navigate('/signup')}
                    >Signup</motion.button>
                </div>
            </motion.section>
        </div>
    )
}

export default Login;
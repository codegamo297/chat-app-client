import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import Logo from '../assets/logo.svg';
import { loginRoute } from '../utils/APIRoutes';

const FromContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background: #131324;

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;

        img {
            height: 5rem;
        }
        h1 {
            color: white;
            font-size: 2rem;
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            font-size: 1rem;
            width: 100%;

            &:focus {
                border: 0.1rem solid #097af0;
                outline: none;
            }
        }

        button {
            position: relative;
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;

            &:hover {
                background-color: #4e0eff;
            }
        }

        span {
            color: white;
            text-transform: uppercase;

            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

function Login() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleValidation();
        if (handleValidation()) {
            const { password, email } = values;
            const { data } = await axios.post(loginRoute, {
                email,
                password,
            });

            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/');
            }
        }
    };

    const handleValidation = () => {
        const { password, email } = values;

        if (email === '') {
            toast.error('You need to enter a email.', toastOptions);
            return false;
        } else if (password === '') {
            toast.error('You need to enter a password.', toastOptions);
            return false;
        } else if (password.length < 6) {
            toast.error('Password should be equal or greater than 6 characters.', toastOptions);
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <>
            <FromContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>snappy</h1>
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />

                    <button type="submit">Login</button>
                    <span>
                        don't have an account? <Link to="/register">Create one</Link>
                    </span>
                </form>
            </FromContainer>
            <ToastContainer />
        </>
    );
}

export default Login;

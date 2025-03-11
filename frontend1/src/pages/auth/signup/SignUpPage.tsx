import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import RedditSVG from "../../../components/svgs/Reddit";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        profileImg: null,
        coverImg: null,
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(response.data);
            // Handle successful signup (e.g., redirect to login page or show success message)
            setSuccessMessage("Account created successfully!");
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Error signing up:', error.response ? error.response.data : error.message);
            // Show error message (e.g., "Email already exists")
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCloseError = () => {
        setErrorMessage("");
    };

    const HandelLoingMove = () => {
        navigate('/login');
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen relative'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <RedditSVG className='lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                {successMessage && (
                    <div className="alert alert-success shadow-lg mb-4 absolute top-10 left-1/2 transform -translate-x-1/2">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="alert alert-error shadow-lg mb-4 absolute top-10 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" onClick={handleCloseError}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        </div>
                    </div>
                )}
                <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
              
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Your name'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                        <span onClick={togglePasswordVisibility} className="cursor-pointer">
                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        </span>
                    </label>
                
                    <div className='form-control mt-6'>
                        <button type='submit' className='btn btn-primary w-full'>
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className='form-control mt-6 w-2/3 mx-auto'>
                    <button onClick={HandelLoingMove} className='btn btn-error w-full'>
                        LogIn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
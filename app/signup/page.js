"use client"

import Link from 'next/link'
import React, { useEffect } from 'react'
import { addDoc, collection, doc, setDoc } from '@firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { Loader } from '../loader';

const Signup = () => {
    const route = useRouter()
    const { authUser, isLoading, setAuthUser } = useAuth();

    useEffect(() => {
        if (!isLoading && authUser) {
            route.push("/");
        }
    }, [authUser, isLoading]);


    const userSignUpHandler = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        // console.log(name, email, password);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(auth.currentUser, {
                displayName: username,
            });
            try {
                await addDoc(collection(db, "users"), {
                    uid: user.uid,
                    email: user.email,
                    password: password,
                    username: username,
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            setAuthUser({
                uid: user.uid,
                email: user.email,
                username: username,
            });
            toast.success('Your Account Is Create!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } catch (error) {
            console.error("An error occured", error);
        }
    }
    return isLoading || (!isLoading && authUser) ? <Loader /> : (
        <div className='flex min-h-screen flex-col items-center justify-center bg-black/50 md:p-12 p-0'>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                    Signup for new account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={userSignUpHandler} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-lg font-medium leading-6 text-white"
                        >
                            Name:
                        </label>
                        <div className="mt-2 ">
                            <input
                                placeholder='Enter your name'
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="bg-transparent border-2 placeholder:text-neutral-300	 border-slate-400 w-full p-2 pl-6 text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-lg font-medium leading-6 text-white"
                        >
                            Email:
                        </label>
                        <div className="mt-2 ">
                            <input
                                placeholder='Enter your email'
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="bg-transparent border-2 placeholder:text-neutral-300	 border-slate-400 w-full p-2 pl-6 text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-lg font-medium leading-6 text-white"
                            >
                                Password:
                            </label>
                        </div>
                        <div className="mt-2 ">
                            <input
                                id="password"
                                name="password"
                                placeholder='Enter your password'
                                type="password"
                                autoComplete="current-password"
                                className="bg-transparent border-2 placeholder:text-neutral-300	 border-slate-400 w-full p-2 pl-6 text-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                href={"/login"}
                                className="font-semibold text-white hover:text-white/80"
                            >
                                Already have an account? Login
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-slate-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign Up
                            <ToastContainer />
                        </button>
                    </div>
                </form>
            </div>
        </div>
        // 
    )
}

export default Signup;
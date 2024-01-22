"use client"
import Link from 'next/link'
import React, { useEffect } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../firebase/auth';
import { Loader } from '../loader';
import { auth } from '../firebase/firebaseConfig';


const Login = () => {
    const route = useRouter()
    const { authUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && authUser) {
            route.push("/");
        }
    }, [authUser, isLoading]);

    const userLoginHandler = (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                toast.success('Your Are Login Successfully!', {
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
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    

    return isLoading || (!isLoading && authUser) ? (<Loader />) :
        (<div className='flex min-h-screen flex-col items-center justify-center bg-black/50 md:p-12 p-0'>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center md:text-3xl text-2xl  font-bold leading-9 tracking-tight text-white">
                    Login to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={userLoginHandler} className="space-y-6">
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
                                href={"/signup"}
                                className="font-semibold text-white hover:text-white/80"
                            >
                                Do not have an account? Signup
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-slate-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Login
                            <ToastContainer />
                        </button>

                    </div>
                </form>
            </div>
        </div>
        )
}

export default Login;
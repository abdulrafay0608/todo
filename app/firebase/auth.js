"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
});

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const authStateChanged = async (user) => {
        console.log(user);
        setIsLoading(true);
        if (!user) {
            setAuthUser(null);
            setIsLoading(false);
            console.log("user not Login");
            return;
        }
        console.log("User is Login");
        setAuthUser({
            uid: user?.uid,
            email: user?.email,
            username: user?.displayName,
        });
        setIsLoading(false);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser,
        isLoading,
        setAuthUser,
    };
}

export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();
    return (
        <AuthUserContext.Provider value={auth}>
            {children}
        </AuthUserContext.Provider>
    );
};

export const useAuth = () => useContext(AuthUserContext);
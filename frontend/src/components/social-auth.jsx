import {
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/apiCall";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import { Button } from "./ui/button";

export const SocialAuth = ({ isLoading, setLoading }) => {
    const [user] = useAuthState(auth);
    const { setCredentials } = useStore((state) => state);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error in signing in with Google", error);
            toast.error("Google Sign-in failed. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        const saveUserToDb = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const userData = {
                    name: user.displayName,
                    email: user.email,
                    provider: "google",
                    uid: user.uid,
                };

                const { data: res } = await api.post("/auth/sign-in", userData);

                if (res?.user) {
                    toast.success(res?.message);
                    const userInfo = { ...res?.user, token: res?.token };

                    // Store user data efficiently
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    setCredentials(userInfo);

                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1500);
                }
            } catch (error) {
                console.error("Something went wrong.", error);
                toast.error(error?.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) saveUserToDb();
    }, [user]); // Fixed dependency array

    return (
        <div></div>
        /*<div className="flex items-center gap-2">
            <Button
                onClick={signInWithGoogle}
                disabled={isLoading}
                variant="outline"
                className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
                type="button"
            >
                <FcGoogle className="mr-2 size-5" />
                Continue with Google
            </Button>
        </div>*/
    );
};

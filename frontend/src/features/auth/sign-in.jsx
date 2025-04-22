import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import useStore from '../../store';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialAuth } from '../../components/social-auth';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/Button.jsx';
import { BiLoader } from 'react-icons/bi';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../libs/apiCall';
import LogoBrand from '../../components/logoBrand';

const LoginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, { message: 'Password is required' })
});

const SignIn = () => {
    const { user, setCredentials } = useStore(state => state);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setLoading(false);
            navigate("/");
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const { data: res } = await api.post("/auth/sign-in", data);

            if (res?.user) {
                toast.success(res?.message, { duration: 1000 });
                const userInfo = { ...res?.user, token: res.token };
                localStorage.setItem("user", JSON.stringify(userInfo));
                localStorage.setItem("token", res.token);
                setCredentials(userInfo);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            }

        } catch (error) {
            console.error("Login error:", error);
            toast.error(error?.response?.data?.message || error.message, { duration: 1000 });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10 bg-gray-50 dark:bg-gray-900'>
            <Card className='w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border-0'>
                <div className='p-6 md:p-8 space-y-4'>
                    <CardHeader className='pb-2 px-0'>
                        <CardTitle className='text-2xl font-bold text-center text-violet-600 dark:text-violet-400'>
                            Login to Account
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='p-0'>
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                            <div className='space-y-6'>
                                <Input
                                    disabled={loading}
                                    id="email"
                                    label="Email Address*"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    error={errors?.email?.message}
                                    {...register("email")}
                                    className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500 dark:text-gray-300"
                                />
                                <div className="relative">
                                    <Input
                                        disabled={loading}
                                        id="password"
                                        label="Password*"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        error={errors?.password?.message}
                                        {...register("password")}
                                        className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500 dark:text-gray-300 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium py-2.5 rounded transition-colors duration-200 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                disabled={loading}
                            >
                                {loading ? (
                                    <BiLoader className="w-5 h-5 mr-2 text-white animate-spin" />
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center pt-6 pb-0 px-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/sign-up" className="text-violet-600 hover:underline font-medium dark:text-violet-400" /*onClick={() => window.location.reload()}*/>
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
};

export default SignIn;

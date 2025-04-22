import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import useStore from '../../store';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialAuth } from '../../components/social-auth';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Separator } from '../../components/separator';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/checkbox';
import { BiLoader } from 'react-icons/bi';
import { FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import api from '../../libs/apiCall';
import LogoBrand from '../../components/logoBrand';

const RegisterSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .min(3, { message: 'Username must be at least 3 characters' })
        .max(20, { message: 'Username must be less than 20 characters' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string({ required_error: 'Confirm your password' }),
    acceptTerms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions'
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const SignUp = () => {
    const { user, register: registerUser } = useStore(state => state);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
        }
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.post("/auth/sign-up", data)
            if (res?.userId) {
                toast.success("Account created successfully! You can now login.", { duration: 1000 })
                setTimeout(() => {
                    navigate("/sign-in");
                }, 1500);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message, { duration: 1000 });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10 bg-gray-50 dark:bg-gray-900'>
            <Card className='w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border-0'>
                <div className='p-6 md:p-8 space-y-4'>
                    <CardHeader className='pb-2 px-0'>
                        <CardTitle className='text-2xl font-bold text-center text-violet-800 dark:text-violet-400'>
                            Register an Account
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='p-0'>
                        {errorMessage && (
                            <Alert variant="destructive" className="mb-6">
                                <FiAlertCircle className="h-4 w-4" />
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                            <div className='space-y-6'>
                                <SocialAuth isLoading={loading || isSubmitting} setLoading={setLoading} />

                                {/*<div className='relative'>
                                    <Separator className="my-4" />
                                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 bg-white dark:bg-gray-800 text-sm text-gray-500">
                                        or register with email
                                    </span>
                                </div>*/}

                                <Input
                                    disabled={loading || isSubmitting}
                                    id="username"
                                    label={<span>Username<span className="text-red-500">*</span></span>}
                                    name="username"
                                    type="text"
                                    placeholder="a unique username"
                                    error={errors?.username?.message}
                                    {...register("username")}
                                    className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500 dark:text-gray-300"
                                />

                                <Input
                                    disabled={loading || isSubmitting}
                                    id="email"
                                    label={<span>Email Address<span className="text-red-500">*</span></span>}
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    error={errors?.email?.message}
                                    {...register("email")}
                                    className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500 dark:text-gray-300"
                                />

                                <div className="relative">
                                    <Input
                                        disabled={loading || isSubmitting}
                                        id="password"
                                        label={<span>Password<span className="text-red-500">*</span></span>}
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a secure password"
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

                                <div className="relative">
                                    <Input
                                        disabled={loading || isSubmitting}
                                        id="confirmPassword"
                                        label={<span>Confirm password<span className="text-red-500">*</span></span>}
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        error={errors?.confirmPassword?.message}
                                        {...register("confirmPassword")}
                                        className="text-sm border dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500 dark:text-gray-300 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="acceptTerms"
                                        disabled={loading || isSubmitting}
                                        {...register("acceptTerms")}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="acceptTerms"
                                            className={`text-xs font-medium leading-none ${errors?.acceptTerms ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                                        >
                                            I accept the <Link to="/terms" className="text-violet-600 hover:underline dark:text-violet-400">Terms of Service</Link> and <Link to="/privacy" className="text-violet-600 hover:underline dark:text-violet-400">Privacy Policy</Link>
                                        </Label>
                                        {errors?.acceptTerms && (
                                            <p className="text-[10px] text-red-500">{errors.acceptTerms.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium py-2.5 rounded transition-colors duration-200 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                disabled={loading || isSubmitting}
                            >
                                {(loading || isSubmitting) ? (
                                    <div className="flex items-center justify-center">
                                        <BiLoader className="w-5 h-5 mr-2 text-white animate-spin" />
                                        Creating account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center pt-6 pb-0 px-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/sign-in" className="text-violet-600 hover:underline font-medium dark:text-violet-400">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;
import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
<Layout title="Create Account">
  <form
    className="mx-auto max-w-screen-md space-y-6"
    onSubmit={handleSubmit(submitHandler)}
  >
    <h1 className="text-2xl font-bold mb-4 text-center">
      Create Account
    </h1>

    <div className="relative">
      <label htmlFor="name" className="block mb-1 font-bold text-gray-700">
        Name
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        id="name"
        autoFocus
        {...register('name', {
          required: 'Please enter name',
        })}
      />
      {errors.name && (
        <div className="absolute top-full text-sm text-red-500">
          {errors.name.message}
        </div>
      )}
    </div>

    <div className="relative">
      <label htmlFor="email" className="block mb-1 font-bold text-gray-700">
        Email
      </label>
      <input
        type="email"
        {...register('email', {
          required: 'Please enter email',
          pattern: {
            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
            message: 'Please enter valid email',
          },
        })}
        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        id="email"
      ></input>
      {errors.email && (
        <div className="absolute top-full text-sm text-red-500">
          {errors.email.message}
        </div>
      )}
    </div>

    <div className="relative">
      <label htmlFor="password" className="block mb-1 font-bold text-gray-700">
        Password
      </label>
      <input
        type="password"
        {...register('password', {
          required: 'Please enter password',
          minLength: { value: 6, message: 'Password must be at least 6 characters long' },
        })}
        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        id="password"
        autoFocus
      ></input>
      {errors.password && (
        <div className="absolute top-full text-sm text-red-500">
          {errors.password.message}
        </div>
      )}
    </div>

    <div className="relative">
      <label htmlFor="confirmPassword" className="block mb-1 font-bold text-gray-700">
        Confirm Password
      </label>
      <input
        className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        type="password"
        id="confirmPassword"
        {...register('confirmPassword', {
          required: 'Please enter confirm password',
          validate: (value) => value === getValues('password'),
          minLength: {
            value: 6,
            message: 'Confirm password must be at least 6 characters long',
          },
        })}
      />
      {errors.confirmPassword &&    errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>

        <div className="mb-4 ">
          <button className="primary-button">Register</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
        </div>
      </form>
    </Layout>
       

  );
}
"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Link , Eye, EyeOff} from 'lucide-react'
import GoogleButton from 'apps/user-ui/src/shared/components/google-button'

type formdata = {
  email: string;
  password: string;
}


const login = () => {
    const [paswordvisible, setPaswordVisible] = useState(false);
    const [serverError, setServerError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
     
    const {
        register,
        handleSubmit,
        formState: { errors, },
    } = useForm<formdata>();

    const onSubmit = (data:formdata) => {
    }

  return (
    <div className= "w-full py-30 min-h-[85vh] bg-[#f1f1f1]">
        <h1 className='text-4xl text-lg  font-semibold font-Poppins'>Login</h1>
        <p className='text-center text-lg font-medium py-3  text-[#00000099]'>home.login</p>

        <div className='w-full flex justify-center'>
            <div className='md:w-[48px] p-8 bg-white shadow rounded-lg '>
                <h3 className='text-center text-3xl font-semibold font-Poppins py-3 text-[#00000099] mb-2'>
                    login to Eshop
                </h3>
                <p>
                   Dont have an account? <span className='text-[#3489ff] font-semibold'>Create an account</span>
                   <Link href={"/signup"} className='text-[#3489ff] font-semibold'>SignUp</Link>
                </p>

                <GoogleButton/>
                <div className='"flex items-centter my-5 text-gray-400 text-sm'>
                  <div className='flex-1 boerder-t border-gray-300'>
                  </div>
                  <span className='px-3'>or sign in  with Email</span>
                  <div className='flex-1 border-t border-gray-300'></div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <label className=" block text-gray-700 mb-1">Email  </label>
                    <input type="email " placeholder='support@becodemy.com' className='w-full p-2 border-gray-300 outline-0 rounded mb-1'{...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address"
                      }
                    }) }
                    />
                    {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}

                    <label className=" block text-gray-700 mb-1">Password</label>
                    <div className="relative">
                    <input type={paswordvisible ? "text" : "password"} 
                    placeholder='Enter your password' 
                    className='w-full p-2 border-gray-300 outline-0 rounded mb-1' 
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })} />
                    <button type='button' onClick={() => setPaswordVisible(!paswordvisible)} className='w-full border border-gary-300 outline-0 top-1/2 rounded mb-1'>
                      {paswordvisible ? <Eye/> : <EyeOff />}
                    </button>
                    {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
                    </div>
                    <div className='flex items-center justify-between my-4'>
                      <label className="flexrx items-center text-gray-600">
                        <input type="checkbox"
                        className='mr-2'
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)} />
                        Remember me
                      </label>  
                      <link rel="stylesheet" href={"/forgot-password"} className='text-blue-500 text-sm ' >
                        Forgot Password?
                      </link>
                    </div>
                    <button type='submit' className='w-full bg-[#3489ff] cursor-pointer bg-black text-white py-2 rounded-lg hover:bg-[#2a6bbf] transition-colors'>
                      Login
                    </button>                   
                </form>
                {serverError && <p className='text-red-500 text-sm mt-2'>{serverError}</p>}
            </div>

        </div>
    </div>
  )
} 

export default login
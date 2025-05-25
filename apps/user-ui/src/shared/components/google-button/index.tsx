import React from 'react';

const GoogleButton = () => {
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full bg-[#3489ff] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    x="0px"
                    y="0px"
                    viewBox="0 0 48 48"
                 >
                    <path
                        d="M12.0001 2C6.47715 2 2.0001 6.47715 2.0001 12C2.0001 17.5228 6.47715 22 12.0001 22C17.5229 22 22.0001 17.5228 22.0001 12C22.0001 6.47715 17.5229 2 12.0001 2ZM12.0001 20C7.58985 20 4.0001 16.4102 4.0001 12C4.0001 7.58985 7.58985 4.0001 12.0001 4.0001C16.4103 4.0001 20.0001 7.58985 20.0001 12C20.0001 16.4102 16.4103 20 12.0001 20Z"
                        fill="white"
                    />
                </svg>
                Sign in with Google
            </div>
        </div>
    );
}
export default GoogleButton;
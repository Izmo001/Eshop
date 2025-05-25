import * as React from 'react';
export const CartIcon= (props : any ) => (
    <svg
        width={props.width || '100%'}
        height={props.height || '100%'}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle
        cx="8.57894"
        cy="5.77894"
        r="4.77894"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round" 
        strokeLinejoin='round'
        />
         
        <path
        fillRule='evenodd'
        clipRule={'evenodd'}
        d="M10002 17.2014C0.5 16.8655 1.07385 16.5337 13.7789 21.5 16.7789 21.5 20.7789"
        />
    </svg>
    );
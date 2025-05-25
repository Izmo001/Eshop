import React from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { ProfileIcon } from '../../assets/svgs/profile_icons'
import { HeartIcon } from '../../assets/svgs/heart_icon'
import { CartIcon } from '../../assets/svgs/cart-icon'
import HeaderBottom from './header-bottom'
const Header = () => {
  return (
    <div className='w-full bg-white'> 
        <div className='w-[80%] py-5 m-auto flex items-center justify-between'>
            <div>
                <Link href="/" className="text-2xl font-600"> 
                <span className="text-3xl font-[500]">Eshop</span>
                </Link>
            </div>
            <div className="w-[50%] relative"> 
            <input type="text" placeholder='search for products...' className='w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489ff] outline-none h-[55px]' />
            <div className='w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489ff] absolute top-0 right-0'>
                <Search color='#fff'/>
            </div>
          
            </div>    
              <div className= "flex items-center gap-8">
                <div className="flex items-center gap-2"> 
                    <Link href={"/login"} className='border-2 w-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]'>
                        <ProfileIcon />
                    </Link>
                    <Link href={"/login"}>
                    <span className= "block font-medium"> hello</span>
                    <span className='font-semibold'>SignIn</span>
                    </Link>
                </div>
                <div>
                    <Link href={"/wishlist"} className='relative'>
                    <HeartIcon/>
                    <div className='w-6 h-6 border-2 borer-white flex items-center jusitfy-center absolute top-[-10px] right[-10px]'>
                        <span className='text-white  font-medium text-sm'>2</span>
                    </div>
                    </Link>
                    <Link href={"/cart"} className='relative'>
                    <CartIcon/>
                    <div className='w-6 h-6 border-2 borer-white flex items-center jusitfy-center absolute top-[-10px] right[-10px]'>
                        <span className='text-white  font-medium text-sm'>0</span>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
        <div className=" border-b norder-b-slate-200"/>
        <HeaderBottom />
    </div>
  )
}

export default Header
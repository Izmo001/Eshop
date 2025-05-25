'use client'
import { useEffect, useState } from 'react';
import { AlignLeft, ChevronDown } from 'lucide-react';
import { navItems } from '../../configs/constants';
// Import or define NavItemtypes
import Link from 'next/link';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`w-[80] relative m-auto flex items-center justify-between ${isSticky ? 'pt-3' : 'py-0'}`}>
      {/* Add dropdowns here */}
      <div
        className={`w-[260px]${isSticky ? ' -mb-2' : ''} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#489fff]`}
        onClick={() => setShow(!show)}
      >
        {/* Dropdown content can go here */}
        <div className='flex items-center gap-2 '>
            <AlignLeft color ='#fff' />
            <span className='text-white font-medium'>All Departments</span>
        </div>
        <ChevronDown color="#fff" />
      </div>
      {/* Dropdown content can go here */}
      {show && (
        <div className={`absolute left-0 ${
            isSticky ? "top-[70px]" : "top-[50px]"}
            w-[260px ] h-[400px] bg-[#f5f5f5]`}> 
        </div>
      )}
      {/*Navigation links */}
      <div className='flex items-center '>
        {navItems.map((i: NavItemTypes, index: number) => (
          <Link href={i.href} key={index} className='px-5 font-medium text-lg'>
            {i.title}
          </Link>
        ))}
      </div>
      <div>
        {/* You can add content here if you want to render something when isSticky is true */}
      </div>
    </div>
  );
};

export default HeaderBottom;

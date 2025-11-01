import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 mt-40 text-sm">

            <div className=''>
                    <img src={assets.logo} className='mb-5 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                            Your most unhappy customers are your greatest source of learning
                    </p>
            </div>
                    <div >
                        <p className='text-xl font-medium mb-5'>COMPANY</p>
                        <ul className='flex flex-col gap-1 text-gray-600'>
                            <li>Home</li>
                            <li>About Us</li>
                            <li>Delivery</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>

                    <div>
                        <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                        <ul className='flex flex-col gap-1 text-gray-600'>
                            <li>+1-212-456-7890</li>
                            <li>Contact@foreveryou.com</li>
                        </ul>
                    </div>

                </div>

                <div >
                        <hr />
                        <p className='py-5 text-sm text-center'>Copyright 2024@ forever.com -ALL RIGHT REVERSED.</p>
                </div>
    </div>
  )
}

export default Footer

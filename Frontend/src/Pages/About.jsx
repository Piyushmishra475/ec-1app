import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../Components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
      <Title text1={"About"} text2={"Us"} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p className='text-lg'>Welcome to our e-commerce store! We are passionate about providing you with the best online shopping experience. Our mission is to offer a wide range of high-quality products at competitive prices, all while ensuring exceptional customer service.</p>
        <p className='text-lg'>At our store, we believe in the power of choice. That's why we curate a diverse selection of products to cater to your unique tastes and preferences. Whether you're looking for the latest fashion trends, cutting-edge electronics, or home essentials, we've got you covered.</p>
        <b className='text-gray-800'>Our Commitment to You</b>
        <p className='text-lg'>We understand that shopping online can sometimes be overwhelming, which is why we've designed our website to be user-friendly and easy to navigate. Our goal is to make your shopping journey as seamless as possible, from browsing to checkout.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={"Our"} text2={"Values"} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We source our products from trusted suppliers to ensure that you receive items that meet the highest standards of quality and durability.</p>
        </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>We strive to make your shopping experience as convenient as possible. With features like easy returns, fast shipping, and multiple payment options, we aim to provide a hassle-free shopping journey.</p>
        </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>We are committed to providing you with the best possible shopping experience. Our customer service team is always ready to assist you with any inquiries or concerns you may have.</p>
        </div>

      </div>
      <NewsLetterBox />

    </div>
  )
}

export default About
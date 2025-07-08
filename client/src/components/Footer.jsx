import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'
      >
        <div>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            src={assets.logo}
            alt='logo'
            className='h-8 md:h-9'
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='max-w-80 mt-3 text-gray-700'
          >
            Drive your dreams with our premium rental fleet — luxury, comfort, and reliability
            combined for your perfect journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='flex items-center gap-3 mt-6'
          >
            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
              <img src={assets.facebook_logo} className='w-5 h-5' alt='Facebook' />
            </a>
            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
              <img src={assets.instagram_logo} className='w-5 h-5' alt='Instagram' />
            </a>
            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
              <img src={assets.twitter_logo} className='w-5 h-5' alt='Twitter' />
            </a>
            <a href='mailto:contact@carrental.com'>
              <img src={assets.gmail_logo} className='w-5 h-5' alt='Email' />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex flex-wrap justify-between w-1/2 gap-8 text-gray-700'
        >
          <div>
            <h2 className='text-base font-semibold uppercase mb-3'>Explore</h2>
            <ul className='flex flex-col gap-1.5'>
              <li>
                <a href='#' className='hover:underline'>
                  Home
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Fleet
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Locations
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-base font-semibold uppercase mb-3'>Support</h2>
            <ul className='flex flex-col gap-1.5'>
              <li>
                <a href='#' className='hover:underline'>
                  Customer Service
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  FAQs
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Booking Guide
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-base font-semibold uppercase mb-3'>Contact Us</h2>
            <ul className='flex flex-col gap-1.5'>
              <li>123, MG Road</li>
              <li>Bengaluru, Karnataka 560001</li>
              <li>+91 98765 43210</li>
              <li>support@carrental.in</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-gray-600 text-center'
      >
        <p>© {new Date().getFullYear()} CarRental Co. All rights reserved.</p>
      </motion.div>
    </motion.div>
  )
}

export default Footer

import React, { useEffect, useRef } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const dummyTestimonials = [
  {
    name: 'Aarav Mehta',
    location: 'Mumbai, India',
    rating: 5,
    image: assets.testimonial_image_1,
    testimonial: 'Booking a car was super easy, and the condition was excellent. Highly recommend!',
  },
  {
    name: 'Neha Sharma',
    location: 'Delhi, India',
    rating: 4,
    image: assets.testimonial_image_2,
    testimonial: 'Great experience! The rental process was smooth, and the support was responsive.',
  },
  {
    name: 'Rahul Verma',
    location: 'Bangalore, India',
    rating: 5,
    image: assets.testimonial_image_1,
    testimonial: 'Amazing service and wide car selection. Will use it again for sure!',
  },
  {
    name: 'Priya Nair',
    location: 'Kochi, India',
    rating: 4,
    image: assets.testimonial_image_1,
    testimonial: 'I loved the flexibility and the pricing. Totally worth it.',
  },
  {
    name: 'Vikram Joshi',
    location: 'Pune, India',
    rating: 5,
    image: assets.testimonial_image_2,
    testimonial: 'Everything was as promised. On time, clean, and great mileage.',
  },
]

const Testimonial = () => {
  const scrollRef = useRef(null)

  useEffect(() => {
    const slider = scrollRef.current
    let scrollAmount = 0
    const scrollSpeed = 1
    const interval = setInterval(() => {
      if (slider) {
        scrollAmount += scrollSpeed
        slider.scrollLeft += scrollSpeed

        if (scrollAmount >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0
          scrollAmount = 0
        }
      }
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='py-28 px-6 md:px-16 lg:px-24 xl:px-44'>
      <Title
        title='What Our Customers Say'
        subTitle='Real experiences from our valued renters across India.'
      />

      <div className='mt-14 overflow-x-auto scrollbar-hide' ref={scrollRef}>
        <div className='flex gap-6 min-w-full w-max pt-7 pb-5'>
          {[...dummyTestimonials, ...dummyTestimonials].map((testimonial, index) => (
            <motion.div
              key={index}
              className='min-w-[280px] max-w-[320px] flex-shrink-0 bg-white p-7 pt-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-center'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className='flex justify-center mb-4'>
                <img
                  className='w-12 h-12 rounded-full object-cover'
                  src={testimonial.image}
                  alt={testimonial.name}
                />
              </div>
              <h3 className='text-xl font-semibold text-black'>{testimonial.name}</h3>
              <p className='text-gray-500 text-sm'>{testimonial.location}</p>
              <div className='flex justify-center gap-1 my-3'>
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <img key={i} src={assets.star_icon} alt='star' className='w-4' />
                  ))}
              </div>
              <p className='text-gray-600 font-light'>"{testimonial.testimonial}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonial

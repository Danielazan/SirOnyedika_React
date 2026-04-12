import React from 'react'
import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Hero from '../../components/LandingPage/Hero'
import Category from '../../components/LandingPage/Category'
import NewArrivals from '../../components/LandingPage/NewArrivals'
import AboutUs from '../../components/LandingPage/AboutUs'
import FlashSales from '../../components/LandingPage/FlashSales'
import TestimonialSection from '../../components/LandingPage/Testimonial'
import FAQ from '../../components/LandingPage/FAQ'
import Newsletter from '../../components/LandingPage/NewsLetter'
import Footer from "../../components/layout/Footer"

const Home = () => {
  return (
    <div>
      <Navbar />
       <Hero/>
       <Category/>
       <NewArrivals/>
       <AboutUs/>
       <FlashSales/>
       <TestimonialSection/>
       <FAQ/>
       <Newsletter/>
       <Footer/>
    </div>
  )
}

export default Home

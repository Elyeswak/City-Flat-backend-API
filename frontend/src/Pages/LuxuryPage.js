import React from 'react'

import LuxuriousCollection from '../components/Luxury/LuxuriousCollection/luxuriousCollection'
import LuxuryCoverPage from '../components/Luxury/LuxuryCoverPage/luxuryCoverPage'
import TopRated from '../components/Luxury/TopRated/topRated'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/footer'

import "../App.css";


function LuxuryPage() {
  return (
   <div className='luxury'>
        <Navbar/>
        <LuxuryCoverPage/>
        <LuxuriousCollection/>
        <TopRated/>
        <Footer/>
   </div> 
    
  )
}

export default LuxuryPage
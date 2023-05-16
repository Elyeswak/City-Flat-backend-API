import React from 'react'

import Navbar from '../components/Navbar/Navbar'
import PremiumCoverPage from '../components/Premium/PremiumCoverPage/PremiumCoverPage'
import Footer from '../components/Footer/footer'
import TopRatedPremium from '../components/Premium/TopRatedPremium/TopRatedPremium'
import PremiumCollection from '../components/Premium/PremiumCollection/PremiumCollection'


function PremiumPage() {
  return (
<div className='premium' style={{backgroundColor:'black'}}>
<Navbar/>
<PremiumCoverPage/>
<PremiumCollection/>
<TopRatedPremium/>
<Footer/>
</div>
  )
}

export default PremiumPage
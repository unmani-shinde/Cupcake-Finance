import { useState } from 'react'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'


function LandingPage() {
  // const [count, setCount] = useState(0)

  return (
    <div style={{height:'100vh',width:"100vw"}} className='root-container-style column'>
        <Banner/>
        <div style={{height:'100vh',width:'100vw'}} className='root-container-style column'>hi</div>
        <Footer/>      
    </div>
  )
}

export default LandingPage

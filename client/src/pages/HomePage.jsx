import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
function HomePage() {

    const {connected} = useWallet();
    const nav = useNavigate();

    return(
        <div style={{width:'100%',height:'100%'}}>
            <div style={{width:'100%',height:'100%',border:"solid 1px black"}} className="root-container-style column background-div">
            <p className="enactus-home-heading">Cupcake Finance</p>
            <WalletSelector />
            {connected && <button className="he" onClick={()=>nav('/dashboard')} style={{marginTop:'1vh'}}>Get Started</button>}
            </div>
            <div style={{ width: '100%', height: '100%' }} className="root-container-style column background-div-two">
  <h1 className="complex" style={{ background: 'linear-gradient(90deg, #c97e64, #d8a679 11.46%, #97d9d7 33.33%, #e99e52)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textAlign: 'center',fontSize:"40px" }}>
    deFI IS COMPLEX.
  </h1>
  <p style={{fontSize:'20px',fontWeight:"700",marginTop:"-3vh"}}>And we're solving for APTOS!</p>
  <p style={{fontSize:'18px'}}>Invest in curated baskets of assets with just one click.</p>
  <p style={{fontSize:'18px'}}>Pre-built baskets: Choose from diverse strategies and risk profiles.</p>

<p style={{fontSize:'18px'}}>Custom baskets: Create your own mix of tokens with adjustable weightings.</p>

<p style={{fontSize:'18px'}}>Simplified 1-to-N swaps: Buy multiple tokens with a single Aptos (APT) deposit.</p>

<p style={{fontSize:'18px',marginTop:"-3vh",maxWidth:'90%',textAlign:'center'}}>Set your desired asset allocations and relax. The protocol rebalances your portfolio automatically over time.</p>
</div>

            
            
            </div>
    
    )
    
}

export default HomePage
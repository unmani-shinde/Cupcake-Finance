import { useState,useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react';

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { NETWORK,NODE_URL,client,provider,cupcake_addr} from '../setup/setup';

function USDTest() {
  // const [count, setCount] = useState(0)
  const {network,wallet,account,connected,disconnect,signAndSubmitTransaction} = useWallet();
  const [inProgress,setInProgress] = useState(false);
  const [APT,setAPT] = useState(0);
  const [USDT,setUSDT] = useState(0);
  const [msg,setMsg] = useState('');

  const SwapAPTOSforUSDT = async () => {

    setInProgress(true);
    const OCTA = APT*100000000;

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${cupcake_addr}::cupcakeDEFI::buy_usdt`,
        typeArguments: [],
        functionArguments: [OCTA],
      },
    });

    try {
      await client.waitForTransaction({ transactionHash: response.hash });
      try {
        await fetch(); // Initial fetch
        setMsg('Transaction Successful!')
      } catch (error) {
        console.error(error);
        setMsg(error)
      } finally {
        setTimeout(() => {
          setMsg('');
          setInProgress(false);
        }, 10000);
      }

    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setMsg('');
        setInProgress(false);
      }, 10000);
    }
  };

  const SwapAPTOSforBTC = async () => {

    setInProgress(true);
    const OCTA = APT*100000000;

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${cupcake_addr}::cupcakeDEFI::buy_btc`,
        typeArguments: [],
        functionArguments: [OCTA],
      },
    });

    try {
      await client.waitForTransaction({ transactionHash: response.hash });
      try {
        await fetch(); // Initial fetch
        setMsg('Transaction Successful!')
      } catch (error) {
        console.error(error);
        setMsg(error)
      } finally {
        setTimeout(() => {
          setMsg('');
          setInProgress(false);
        }, 10000);
      }

    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setMsg('');
        setInProgress(false);
      }, 10000);
    }
  };

  return (
    <div className='root-container-style column' style={{width:'100%',height:'100%'}}>
      <WalletSelector />
      {connected && (network?.name.toString()).toLowerCase() ===NETWORK &&
        <div className='root-container-style column' style={{width:'98%',height:'100%',border:'solid 2px #392467',margin:'1vw'}}>
            <h3 className='account-details' style={{color:'black'}}>Account Address: {account?.address}</h3>
            <h3 className='account-details' style={{color:'black'}}>Public Key: {account?.publicKey}</h3>
            <form className='root-container-style column'>
                <div className='root-container-style'>
                  <label>
                    Enter APT:
                    <input type="number" value={APT} onChange={(e)=>{setAPT(e.target.value)}} />
                  </label>
                </div>
                {/* <div className='root-container-style' style={{marginTop:"2vh",marginBottom:'2vh'}}>
                  <label>
                    Enter USDT:
                    <input type="number" value={USDT} onChange={(e)=>{setUSDT(e.target.value)}} />
                  </label>
                </div> */}
            </form>
            <div className='root-container-style row'>
            {inProgress?(<h1>{msg==""?"Your Transaction is in Progress, please wait...":msg}</h1>):(<button className='meow' onClick={SwapAPTOSforUSDT}>Swap APTOS for USDT</button>)}
            {inProgress?(<h1>{msg==""?"Your Transaction is in Progress, please wait...":msg}</h1>):(<button className='meow' onClick={SwapAPTOSforBTC}>Swap APTOS for BTC</button>)}

            </div>
            
          


        {/* <div style={{width:'50%',height:'95%',alignSelf:'center',alignItems:'center',justifyContent:'center',borderRight:'solid 2px white',display:'flex',flexDirection:'column'}}>
        <h2 style={{color:'pink',maxWidth:'70%'}}>Account Details</h2>
        <div className='account-details' style={{ border:'solid 1px blue',textAlign:'left',paddingLeft:'5vw' }}>
              <h3>Address: {account?.address}</h3>
              <h3>Public Key: {account?.publicKey}</h3>
</div>

        </div>
        <div style={{width:'50%',height:'95%',alignSelf:'center',alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'column'}}>
        <h2 style={{color:'pink'}}>Account Details</h2>
          <div className='account-details'>
            
            <h3>Address: {account?.address}</h3>
            <h3>Public Key: {account?.publicKey}</h3>
          </div>
        </div> */}
      </div>
      
      }
      
      
      
         
    </div>
  )
}

export default USDTest

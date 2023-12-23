import { useState,useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Button, Spin, List, Checkbox, Input,Form } from "antd";
import { NETWORK,client,provider,cupcake_addr,meow_addr} from '../setup/setup';

function Dashboard() {

    
    const {network,wallet,account,connected,disconnect,signAndSubmitTransaction} = useWallet();
    const nav = useNavigate();
    const [showForm,setShowForm] = useState(false);
    const [showWithdraw,setShowWithdraw] = useState(false);
    const [showWithdrawForm,setShowWithdrawForm] = useState(false);
    const [basketCount,setBasketCount] = useState(0);
    const [tokenBaskets,setTokenBaskets] = useState([]);
    const [usdtAmount, setUsdtAmount] = useState('');
  const [btcAmount, setBtcAmount] = useState('');

  const labelStyle = {
    display: 'block',
    margin: '15px 0',
    fontWeight:'700',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
  };
  
  const inputStyle = {
    padding: '10px',
    height:'5vh',
    margin: '5px 0',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontFamily: 'Poppins, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };
  
  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    fontWeight:'700',
    border: 'none',
    borderRadius: '5px',
    height:'9vh',
    width:'50%',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background-color 0.3s ease',
  };
  
  
  

  const handleUsdtInputChange = (e) => {
    setUsdtAmount(e.target.value);
  };

  const handleBtcInputChange = (e) => {
    setBtcAmount(e.target.value);
  };
    const [formState, setFormState] = useState({
        APT: 0,
        BTCRatio: 0,
        USDTRatio: 0,
        RebalanceInterval:0,
      });
    
      const handleInputChange = (fieldName, value) => {
        setFormState((prevState) => ({
          ...prevState,
          [fieldName]: value,
        }));
      };

      useEffect(() => {
        const fetchData = async () => {
          try {
            // setLoading(true);
            await fetch(); // Initial fetch
          } catch (error) {
            console.error(error);
          } finally {
            // setLoading(false);
          }
        };
    
        fetchData();
       
      }, [account?.address]);
    
      const fetch = async () => {
        try {
          
          const user = await provider.getAccountResource(
            account?.address,
            `${meow_addr}::cupcakeDEFI::User`,
          );

          const token_basket_count = JSON.parse(user.data.userTokenBasketCount);
          const tableHandle = user.data.userTokenBaskets.handle;
          let token_baskets = [];
      let counter = 1;
      while (counter <= token_basket_count) {
        const tableItem = {
          key_type: "u64",
        //   value_type: "address",
          value_type: `${meow_addr}::cupcakeDEFI::Basket`,
          key: `${counter}`,
        };
        const token_basket = await client.getTableItem(tableHandle, tableItem);
        token_baskets.push(token_basket);
        counter++;
      }
      setBasketCount(token_basket_count);
      setTokenBaskets(token_baskets);
    
         
          // tasks table counter
    
        //   let retrieved_baskets = [];
        //   let counter = 1;
        //   while (counter <= basketCount) {
        //     const tableItem = {
        //       key_type: "u64",
        //       value_type: `${meow_addr}::cupcakeDEFI::User`,
        //       key: `${counter}`,
        //     };
        //     const basket = await client.getTableItem(tableHandle, tableItem);
        //     retrieved_baskets.push(basket);
        //     counter++;
          //}
          // set tasks in local state
        //   setBaskets(retrieved_baskets);
        //   console.log(baskets);
          
          // if(reload){
          //   window.location.reload();
          // }
        }
        catch (error) {
          console.log(error);;
        }
      }

      const CreateTokenBasket = async () => {
    
        // console.log('APT to Swap: ', formState.APT," Variable Type: ",typeof(formState.APT));
        // console.log('BTC Ratio: ', formState.BTCRatio," Variable Type: ",typeof(formState.BTCRatio));
        // console.log('USDT Ratio: ', formState.USDTRatio," Variable Type: ",typeof(formState.USDTRatio));
        // console.log('ETH Ratio: ', formState.ETHRatio," Variable Type: ",typeof(formState.ETHRatio));
    
        const OCTA = formState.APT*100000000;
        const OCTA_FOR_BTC = (OCTA * formState.BTCRatio)/100;
        const OCTA_FOR_USDT = (OCTA *formState.USDTRatio)/100;
    
        // console.log(typeof(OCTA_FOR_BTC));
        // console.log(typeof(OCTA_FOR_USDT));
        // console.log(typeof(OCTA_FOR_ETH));
    
      
    
        const response = await signAndSubmitTransaction({
          sender: account.address,
          data: {
            function: `${meow_addr}::cupcakeDEFI::create_token_basket`,
            typeArguments: [],
            functionArguments: [OCTA,OCTA_FOR_USDT,OCTA_FOR_BTC,formState.USDTRatio,formState.BTCRatio,formState.RebalanceInterval],
          },
        });
    
        try {
          await client.waitForTransaction({ transactionHash: response.hash });
          try {
            await fetch(); // Initial fetch
          } catch (error) {
            console.error(error);
            
          }     
        } catch (error) {
          console.error(error);
          
        }
    
        // Add your logic here...
      };

      const ReverseSwap = async () => {
    
        // console.log('APT to Swap: ', formState.APT," Variable Type: ",typeof(formState.APT));
        // console.log('BTC Ratio: ', formState.BTCRatio," Variable Type: ",typeof(formState.BTCRatio));
        // console.log('USDT Ratio: ', formState.USDTRatio," Variable Type: ",typeof(formState.USDTRatio));
        // console.log('ETH Ratio: ', formState.ETHRatio," Variable Type: ",typeof(formState.ETHRatio));
    
    
        const BTC_FOR_OCTA = btcAmount;
        const USDT_FOR_OCTA = usdtAmount;
    
        // console.log(typeof(OCTA_FOR_BTC));
        // console.log(typeof(OCTA_FOR_USDT));
        // console.log(typeof(OCTA_FOR_ETH));
    
      
    
        const response = await signAndSubmitTransaction({
          sender: account.address,
          data: {
            function: `${meow_addr}::cupcakeDEFI::reverse_swap`,
            typeArguments: [],
            functionArguments: [USDT_FOR_OCTA,BTC_FOR_OCTA],
          },
        });
    
        try {
          await client.waitForTransaction({ transactionHash: response.hash });
          try {
            await fetch(); // Initial fetch
          } catch (error) {
            console.error(error);
            
          }     
        } catch (error) {
          console.error(error);
          
        }
    
        // Add your logic here...
      };
    

    return(
        <div style={{width:"100%", height:'100%'}} className="root-container-style column">
            <div style={{width:"100%", height:'13%',borderBottom:'solid 2px white'}}className="root-container-style row">
            <div className="logo"></div>
            <h1 className="heading">Cupcake Finance</h1>
            
            </div>
            
            
            {connected && (network?.name.toString()).toLowerCase() ===NETWORK &&
        
            
            <div style={{width:"100%", height:'87%',}}className="root-container-style row">
            <div style={{width:"10%", height:'100%',borderRight:'solid 2px white'}}
            className="root-container-style column">
                <ul style={{ listStyle: 'none', width: '100%', height: '100%',display:'flex',justifyContent:'center',flexDirection:'column', padding: 0, alignSelf:'center',alignItems:'center'}}>
                    <li>
                        <button className='meow' onClick={() => nav('/')} style={{fontWeight:"700"}}>Home</button>
                    </li>
                    <li>
                        <button className='meow' onClick={() => nav('/dashboard')} style={{fontWeight:"700"}}>Create</button>
                    </li>
                    <li>
                        <button className='meow'onClick={() => nav('/select-basket')} style={{fontWeight:"700"}}>Select</button>
                    </li>
                </ul>




            </div>
            <div style={{width:"90%", height:'100%',borderRight:'solid 2px white'}}
            className="root-container-style column">
                <h2 style={{textAlign:'left',color:"white",marginBottom:'-2vh'}}>Hello User! ({account?.address.toString().slice(0, 4) + '...' + account?.address.toString().slice(-4)})</h2>
                <div style={{width:"100%", height:'90%',borderRight:'solid 2px white'}}
            className="root-container-style row">
                 <div style={{width:"50%", height:'90%',borderRight:'solid 2px white'}}
            className="root-container-style column">
                {!showWithdraw && <div className="create-basket" style={{width:"90%",height:'90%'}}>
                  <div className="left">
                    <h2>Create a Token Basket</h2>
                    <Button style={{fontWeight:'700',border:'solid 1px black',width:"100%",transform:'scale(0.75)',marginTop:'-2vh',marginBottom:"3vh"}} onClick={()=>{setShowWithdraw(true)}}>OR Swap ALT Coin for APT</Button>
                    
                    {!showForm && <h5>
                      Create and manage Token Baskets and onboard capital easily
                    </h5>}
                    {!showForm && <Button  block type="primary" onClick={()=>setShowForm(true)}>
                      + Create
                    </Button>}
                    {showForm &&  <Form style={{marginTop:"-4vh"}} className='root-container-style column'>
      {Object.entries(formState).map(([fieldName, fieldValue]) => (
        <div className='root-container-style column' key={fieldName}>
          <label className='root-container-style column' style={{color:'white',fontWeight:"700"}}>
            {`Enter ${fieldName}:
            `}
            <input
              type="number"
              value={fieldValue}
              style={{backgroundColor:'transparent',border:'solid 1px white',padding:'1.5vh',color:"white",marginBottom:"1vh",borderRadius:"10px"}}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
            />
          </label>
        </div>
      ))}
    </Form> }
    {showForm &&<Button block type="primary" onClick={CreateTokenBasket} style={{backgroundColor:'transparent',textDecoration:'underline',textTransform:"uppercase",fontWeight:"700",transform:'scale(0.75)',border:'none',marginTop:"-2vh"}}>
                      + Create
                    </Button> }
    
                  </div>
                  <div className="right"></div>
                </div>}
                {showWithdraw && <div className="create-basket" style={{width:"90%",height:'90%'}}>
                <div className="left">
                    <h2> Get APT from ALT Coins</h2>
                    <Button style={{fontWeight:'700',border:'solid 1px black',width:"100%"}} onClick={()=>{setShowWithdraw(false)}}>OR Create a Basket</Button>
                    {!showWithdrawForm && <h5>
                      USDT AND BTC back to APT. All transactions in a single click.
                    </h5>}
                    {!showWithdrawForm && <Button block type="primary" onClick={()=>setShowWithdrawForm(true)}>
                      + Create
                    </Button>}
                    {showWithdrawForm && <h5>
                        <Form style={{ textAlign: 'center' }}>
  <label style={labelStyle}>
    USDT Amount:
    <input
      type="number"
      value={usdtAmount}
      onChange={handleUsdtInputChange}
      step="any"
      style={inputStyle}
      required
    />
  </label>

  <label style={labelStyle}>
    BTC Amount:
    <input
      type="number"
      value={btcAmount}
      onChange={handleBtcInputChange}
      step="any"
      style={inputStyle}
      required
    />
  </label>

  <button type="submit" onClick={ReverseSwap} style={buttonStyle}>
    Submit
  </button>
</Form>

                    </h5>}
                </div>
                <div className="right"></div>

                </div>
                    
                }
                
            </div>
             <div style={{width:"50%", height:'90%',}}
            className="root-container-style column">
                <div className="profile" style={{ height: '97%',display:'flex',justifyContent:'center',flexDirection:'column'}}>
                <h2 style={{textAlign:'center',color:"white",fontSize:"20px",marginBottom:'-4vh'}}>My Token Baskets</h2>
                 <p style={{textAlign:'center',color:"white",fontSize:"15px",fontWeight:'400'}}>{basketCount==0?"Nothing to show here yet! ":""}
                <b>CREATE</b> your own Token Basket or go to <b>SELECT</b></p>
                {basketCount !== 0 && (
 <table style={{ borderCollapse: 'collapse', width: '100%' }}>
 <thead>
   <tr>
     <th style={{ backgroundColor: '#7752FE', color: 'white', padding: '10px', textAlign: 'left' }}>Basket ID</th>
     <th style={{ backgroundColor: '#7752FE', color: 'white', padding: '10px', textAlign: 'left' }}>Description</th>
   </tr>
 </thead>
 <tbody>
   {tokenBaskets.map((basket, index) => (
     <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
       <td style={{ padding: '10px' }}>
        <div style={{display:'flex',flexDirection:'row'}}>
            <span>{basket.basketID}</span>
            <button
  disabled={basket.basketRebalanceInterval > 0}
  style={{
    color: basket.basketRebalanceInterval > 0 ? '#45a049' : 'black',
    backgroundColor:'white',
    cursor: 'pointer',
    fontWeight:'700',  
    borderRadius:'5px',
    marginLeft:'3vh' 
              // Show pointer cursor when not disabled
              // Remove default focus outline
  }}
>
  Rebalance
</button>

        
        </div>
        </td>
       <td style={{ padding: '10px',display:'flex',flexDirection:'column' }}>
        <div style={{display:'flex',flexDirection:'row'}}>
        <span style={{ marginRight: '10px',fontWeight:'700', }}>BTC: </span>
        <progress
            value={basket.basketBTCRatio}
            max="100"
            style={{ width: '100px', height: '15px' }}
        ></progress>
        </div>

        <div style={{display:'flex',flexDirection:'row'}}>
        <span style={{ marginRight: '10px',fontWeight:'700',}}>USDT:</span>
  <progress
    value={basket.basketUSDTRatio}
    max="100"
    style={{ width: '100px', height: '15px' }}
  ></progress>

        </div>
  

  
</td>

       {/* Add more cells as needed */}
     </tr>
   ))}
 </tbody>
</table>

)}

                </div>

               
            </div>
            </div>
            </div>
                

            </div>
            
            
            
            }
            
            
    </div>
    
    )

   
}

export default Dashboard
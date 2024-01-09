import React,{ useState,useEffect } from "react";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { client,provider,cupcake_addr,NETWORK } from "../setup/connect";
import {Alert, Button, Col,Layout, Row, Spin,Input} from "antd";
function Page() {

    const {network,account,connected,signAndSubmitTransaction, submitTransaction} = useWallet();
    
    const [resourceAddr,setResourceAddr] = useState('');
    const [sourceAddr,setSourceAddr] = useState('');
    const [APT,setAPT] = useState(0);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            await fetch(); // Initial fetch
          } catch (error) {
            console.error(error);
          }
          finally{
            setLoading(false);
          }
        };
        fetchData();    
      }, [account?.address]);
    
      const fetch = async () => {
        if (!account) return;
        try {
          
          const resource_acct_info = await provider.getAccountResource(
            account.address,
            `${cupcake_addr}::cupcake_finance::ResourceAccountInfo`,
          );

          var resource_addr = resource_acct_info.data.resource_addr;
          setResourceAddr(resource_addr);
          console.log(resourceAddr);

          var source_addr = resource_acct_info.data.source;          
          setSourceAddr(source_addr);
          console.log(source_addr);
          console.log("hi");
    
          
        }
        catch (error) {
          console.log(error);;
        }
      }

      const withdrawfromResourceAccount = async ()=>{
        setLoading(true);

        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
              function: `${cupcake_addr}::cupcake_finance::withdraw_from_resource_account`,
              typeArguments: [],
              functionArguments: [sourceAddr],
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
          finally{
            setLoading(false);
          }

      }

      const createResourceAccount = async () =>{
        setLoading(true);
        console.log("APT: ",APT);
        console.log("In Octa: ",APT*100000000);

        
        

        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
              function: `${cupcake_addr}::cupcake_finance::deposit_in_resource_account`,
              typeArguments: [],
              functionArguments: [[10,20,30],APT*100000000],
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
          finally{
            setLoading(false);
          }
      }
    

    return(
        <div style={{height:"100%",width:'100%',overflowX:'hidden',display:'flex',flexDirection:'column',overflowY:'hidden'}}>
    
      <Layout style={{maxHeight:"20vh",backgroundColor:'transparent'}}>
        <Row align="middle" style={{borderBottom:'solid 2px black'}}>
          <Col flex={"auto"}>
            <h1 style={{color:"#262626"}}>Resource Account Test ({network?.name.toString()})</h1>
          </Col>
          <Col flex={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      {!connected && <Alert style={{width:"50%",justifyContent:'center',alignSelf:"center",marginTop:"30vh",backgroundColor:'transparent',border:'solid 2px white',color:'white'}} message={`Please connect your wallet`} type="info" />}
      {connected && (network?.name.toString()).toLowerCase() !== NETWORK && (
        <Alert
          message={`Wallet is connected to ${network?.name}. Please connect to ${NETWORK}`}
          type="warning"
          
        />
      )}
      {connected && (network?.name.toString()).toLowerCase() === NETWORK && <div style={{display:'flex',flexDirection:'column',height:"100vh",color:'#00ADB2'}}>
        <p style={{fontWeight:'700',fontSize:'larger'}}>Connected Wallet Address:<br></br> {account?.address}</p>
            <Spin spinning={loading}>
                {(resourceAddr==="" && sourceAddr==="")? 
                    (<div style={{display:'flex',flexDirection:'column',alignSelf:'center',alignItems:"center"}}>
                        <h1>No resource Account has been created yet.</h1>
                        <Input value={APT} onChange={(e)=>{setAPT(e.target.value)}} style={{width:"50%", marginBottom:'4vh'}} type="number"></Input>
                        <Button style={{width:"50%"}} onClick={createResourceAccount}>Create Resource Account</Button>
                    </div>):(<div style={{display:'flex',flexDirection:'column',width:"100%"}}>
                        <p style={{fontSize:'large',fontWeight:'700'}}>Source Address:<br></br> {sourceAddr}</p>
                        <p style={{fontSize:'large',fontWeight:"700"}}>Resource Address:<br></br> {resourceAddr}</p>
                        <Button style={{width:'40%',height:'10vh',alignSelf:'center',fontWeight:'700',color:'#262626'}} onClick={withdrawfromResourceAccount}>Withdraw From Resource Account</Button>
                    </div>)}

            </Spin>
        

      </div>}
     
    </div>
    )
    
}

export default Page;

// module.exports = withdrawfromResourceAccount;
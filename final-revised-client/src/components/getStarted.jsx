
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { NETWORK,client,provider,cupcake_addr,meow_addr} from '../setup/setup';




function GetStarted() {
  const [openModal, setOpenModal] = useState(true);
  const [email, setEmail] = useState('');
  const {connected,account} = useWallet();
  const navigate = useNavigate();

  function onCloseModal() {
    setOpenModal(false);
    setEmail('');
  }

  const handleSignup = ()=>{
    navigate('/dashboard-home'); 
  }

  
  return (
    <>
      
      <Modal show={true} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          {connected && <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"><b>Create an Account</b></h3>
            <div>
              <div className="mb-2 block">
                <Label style={{fontWeight:'bold'}} htmlFor="wallet-address" value="Connected Wallet Address" />
              </div>
              <TextInput
                id="email"
                // placeholder="name@company.com"
                value={account.address}
                readOnly
              />
            </div>
            
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your Email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                Can't connect wallet?
              </a>
            </div>
            <div className="w-full">
              <Button onClick={handleSignup}>Create Account</Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Already have an account?&nbsp;
              <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
                Sign in
              </a>
            </div>
          </div>}


          {!connected && <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"><b>Connect Petra Wallet</b></h3>
            <WalletSelector/>
          </div>}
          
        </Modal.Body>
      </Modal>
    </>
  );
}


export default GetStarted

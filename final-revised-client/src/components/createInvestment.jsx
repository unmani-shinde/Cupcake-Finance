

import { Button, Checkbox, Label, Modal, TextInput,Radio,Table } from "flowbite-react";
import { useState } from "react";
// import SelectTokens from "./selectTokens";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
// import { useNavigate } from 'react-router-dom';
import { NETWORK,client,provider,cupcake_addr,meow_addr} from '../setup/setup';

function CreateInvestment() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [timeStamp,setTimeStamp] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('APT'); // Default to USD
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [rebalanceInterval,setRebalanceInterval] = useState(0);
  const {connected,account,signAndSubmitTransaction} = useWallet();

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [individualCheckboxStates, setIndividualCheckboxStates] = useState({
    apt: false,
    usdt: false,
    btc: false,
  });
  const [ratioInputsEnabled, setRatioInputsEnabled] = useState({
    apt: false,
    usdt: false,
    btc: false,
  });
  const [ratios, setRatios] = useState({
    apt: 0,
    usdt: 0,
    btc: 0,
  });

  // Function to handle header checkbox click
  const handleHeaderCheckboxClick = () => {
    setSelectAllChecked(prev => !prev);
    setIndividualCheckboxStates(prev => {
      return Object.keys(prev).reduce((acc, key) => {
        acc[key] = !prev[key];
        return acc;
      }, {});
    });
    setRatioInputsEnabled(prev => {
      return Object.keys(prev).reduce((acc, key) => {
        acc[key] = !prev[key];
        return acc;
      }, {});
    });
  };

  // Function to handle individual checkbox click
  const handleIndividualCheckboxClick = (token) => {
    setIndividualCheckboxStates(prev => {
      const updatedState = { ...prev, [token]: !prev[token] };
      const allChecked = Object.values(updatedState).every(value => value === true);
      setSelectAllChecked(allChecked);
      return updatedState;
    });
    setRatioInputsEnabled(prev => ({
      ...prev,
      [token]: !prev[token],
    }));
  };

  // Function to handle ratio input change
  const handleRatioInputChange = (event, token) => {
    const { value } = event.target;
    setRatios(prev => ({
      ...prev,
      [token]: value,
    }));

    // Automatically autofill values for other tokens
    
  };

  function onCloseModal() {
    setOpenModal(false);
    setEmail('');
  }

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    return `${date} ${time}`;
  };

  const CreateTokenBasket = async () => {
    
    const OCTA = investmentAmount*100000000;
    const OCTA_FOR_BTC = (OCTA * ratios.btc)/100;
    const OCTA_FOR_USDT = (OCTA*ratios.usdt)/100;
    console.log(OCTA,OCTA_FOR_BTC,OCTA_FOR_USDT);
    console.log(ratios.btc,ratios.usdt);

    console.log(typeof(OCTA_FOR_BTC));
    console.log(typeof(OCTA_FOR_USDT));
    // console.log(typeof(OCTA_FOR_ETH));

  

    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${meow_addr}::cupcakeDEFI::create_token_basket`,
        typeArguments: [],
        functionArguments: [OCTA,OCTA_FOR_USDT,OCTA_FOR_BTC,ratios.usdt,ratios.btc,rebalanceInterval],
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

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>+ New Token Basket</Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"><b>Create New Token Basket</b></h3>
            <div>
              <div className="mb-2 block">
                <Label style={{fontWeight:'bold'}} htmlFor="email" value="Total Portfolio Investment Value" />
              </div>
              <Radio
              
                  id="usd"
                  name="currency"
                  checked={selectedCurrency === 'USD'}
                  onChange={() => setSelectedCurrency('USD')}
                />
                 <Label style={{marginLeft:'1vw'}} htmlFor="usd">In USD</Label>
                <Radio
                  id="apt"
                  style={{marginLeft:'2vw'}}
                  defaultChecked
                  name="currency"
                  checked={selectedCurrency === 'APT'}
                  onChange={() => setSelectedCurrency('APT')}
                />
                <Label style={{marginLeft:'1vw'}} htmlFor="apt">In APT</Label>
              <TextInput
                id="investmentAmount"
                placeholder="0.00"
                style={{marginTop:'2vh'}}
                type="number"
                value={investmentAmount}
                onChange={(event) => setInvestmentAmount(event.target.value)}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label style={{fontWeight:'bold'}} htmlFor="email" value="Rebalance Interval in Days (Enter 0 for no Rebalance)" />
              </div>
              <TextInput
                id="rebalanceInterval"
                placeholder='0'
                style={{marginTop:'2vh'}}
                type="number"
                value={rebalanceInterval}
                onChange={(event) => setRebalanceInterval(event.target.value)}
                required
              />
            </div>




            <div>
              <div className="mb-2 block">
                <Label style={{fontWeight:'bold'}} htmlFor="password" value="Select Tokens and Distribution Ratio" />
              </div>
              {/* <TextInput id="password" type="password" required /> */}
              <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox checked={selectAllChecked} onChange={handleHeaderCheckboxClick} />
          </Table.HeadCell>
          <Table.HeadCell>Available Token</Table.HeadCell>
          <Table.HeadCell>Ratio</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                checked={individualCheckboxStates.apt}
                onChange={() => handleIndividualCheckboxClick('apt')}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'Aptos Coin (APT)'}
            </Table.Cell>
            <Table.Cell>
              {ratioInputsEnabled.apt && (
                <TextInput
                  placeholder="Value"
                  value={ratios.apt}
                  type="number"
                  onChange={(event) => handleRatioInputChange(event, 'apt')}
                />
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                checked={individualCheckboxStates.usdt}
                onChange={() => handleIndividualCheckboxClick('usdt')}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Tether (USDT)
            </Table.Cell>
            <Table.Cell>
              {ratioInputsEnabled.usdt && (
                <TextInput
                  placeholder="Value"
                  type="number"
                  value={ratios.usdt}
                  onChange={(event) => handleRatioInputChange(event, 'usdt')}
                />
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                checked={individualCheckboxStates.btc}
                onChange={() => handleIndividualCheckboxClick('btc')}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">Bitcoin (BTC)</Table.Cell>
            <Table.Cell>
              {ratioInputsEnabled.btc && (
                <TextInput
                  placeholder="Value"
                  value={ratios.btc}
                  type="number"
                  onChange={(event) => handleRatioInputChange(event, 'btc')}
                />
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label style={{fontWeight:'bold'}} htmlFor="currentDateTime" value="Date & Time of Investment" />
              </div>
              <TextInput
                id="currentDateTime"
                placeholder={getCurrentDateTime()}
                readOnly // Prevent user input
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember my preferences</Label>
              </div>
             
            </div>
            <div className="w-full">
              <Button onClick={CreateTokenBasket}><b>Create Token Basket</b></Button>
            </div>
           
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateInvestment

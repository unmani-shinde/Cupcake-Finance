import { Card } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NETWORK, client, provider, cupcake_addr, meow_addr } from '../setup/setup';
import { LinkIcon } from "@heroicons/react/24/outline";

function RecentInvestments() {
  const location = useLocation();
  const [basketCount, setBasketCount] = useState(-1);
  const [tokenBaskets, setTokenBaskets] = useState([]);
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(); // Initial fetch
      } catch (error) {
        console.error(error);
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
      let counter = token_basket_count;
      while (counter > 0) {
        const tableItem = {
          key_type: "u64",
          //   value_type: "address",
          value_type: `${meow_addr}::cupcakeDEFI::Basket`,
          key: `${counter}`,
        };
        const token_basket = await client.getTableItem(tableHandle, tableItem);
        token_baskets.push(token_basket);
        counter--;
      }

      setBasketCount(token_basket_count);

      // Set token baskets based on location path
      if (location.pathname === "/dashboard-home") {
        // Display only the latest 5 token baskets
        setTokenBaskets(token_baskets.slice(Math.max(token_baskets.length - 5, 0)));
      } else if (location.pathname === "/investment-portfolio") {
        // Display all token baskets
        setTokenBaskets(token_baskets);
      }
      console.log(token_baskets);
    }
    catch (error) {
      console.log(error);
    }
  }

  // Function to determine the heading based on the path
  const getHeading = () => {
    if (location.pathname === "/dashboard-home") {
      return "Latest Investments";
    } else if (location.pathname === "/investment-portfolio") {
      return "Investment Summary";
    } else {
      return "Recent Investments"; // Default heading if path doesn't match
    }
  };

  return (
    <Card className="max-w-sm w-200 h-100">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{getHeading()}</h5>
        {location.pathname === "/dashboard-home" && <button onClick={()=>{navigate('/investment-portfolio')}} className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
          View all
        </button>}
      </div>
      <div className="flow-root">
        <ul  style={{overflowY:'scroll'}}className="divide-y divide-gray-200 dark:divide-gray-700">
        {tokenBaskets.map((tokenBasket, index) => (
            <li key={index} className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <img
                  alt="Neil image"
                  height="32"
                  src={(tokenBasket.basketRebalanceInterval>0)?"https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1729&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":'https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                  width="32"
                  className="rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p  style={{fontWeight:'bold'}} className="truncate text-sm font-medium text-gray-900 dark:text-white">{tokenBasket.basketRebalanceInterval>0?"FOR_REBAL":"SWAP_ONL"}</p>
                <p style={{cursor:"pointer"}}onClick={()=>{navigate('/')}}className="truncate text-sm text-gray-500 dark:text-gray-400">View Investment Details</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{tokenBasket.basketAPT/100000000} APT</div>
            </div>
          </li>))}
          
         
          
        
        </ul>
      </div>
    </Card>
  );
}

export default RecentInvestments






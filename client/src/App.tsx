import React from "react";
import logo from "./logo.svg";
import hi from "./hi.png";
import "./App.css";
import { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Button,
  Spin,
  Input,
  Dropdown,
  Checkbox,
  Form,
  Radio,
  Slider,
} from "antd";
import { DollarOutlined, EuroOutlined, PoundOutlined } from "@ant-design/icons";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import type { MenuProps } from "antd";
import { on } from "events";

const usdt_slider: MenuProps["items"] = [
  {
    label: "set USDT ratio",
    key: "1",
    icon: <DollarOutlined />,
  },
];

const aptosConfig = new AptosConfig({ network: Network.MAINNET });

type Token = {
  address: string;
  name: string;
  ratio: number;
};

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [usdtRatio, setUsdtRatio] = useState<number>(0);
  const [btcRatio, setBtcRatio] = useState<number>(0);
  // const baskets: React.SetStateAction<any[]>=[];
  const [myBaskets, setMyBasket] = useState<number[][]>([]);
  const [usdtSlider, setUSDTSlider] = useState<boolean>(false);
  const [btcSlider, setBTCSlider] = useState<boolean>(false);
  const [aptSlider, setAPTSlider] = useState<boolean>(false);
  const [createBtnActive, setCreateBtnActive] = useState<boolean>(false);
  const [accountHasBasket, setAccountHasBasket] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);

  // setting USDT ratio
  const selectUSDT = async () => {
    setUSDTSlider(true);
    setBTCSlider(false);
    setAPTSlider(false);
  };

  const submitUSDTRatio = async () => {
    setUSDTSlider(false);
  };

  const onChangeUSDT = async (newRatio: number) => {
    setUsdtRatio(newRatio);
  };

  //setting BTC ratio
  const selectBTC = async () => {
    setBTCSlider(true);
    setAPTSlider(false);
    setUSDTSlider(false);
  };

  const submitBTCRatio = async () => {
    setBTCSlider(false);
  };

  const onChangeBTC = async (newRatio: number) => {
    setBtcRatio(newRatio);
  };

  //setting APT ratio
  const selectAPT = async () => {
    setAPTSlider(true);
    setBTCSlider(false);
    setUSDTSlider(false);
  };

  const submitAPTRatio = async () => {
    setAPTSlider(false);
  };

  const submitBasket = async () => {
    setCreateBtnActive(false);
    setCreateBtnActive(false);
    const a = usdtRatio;
    const b = btcRatio;
    const c = 100 - usdtRatio - btcRatio;
    const baskets = [...myBaskets];
    baskets.push([a,b,c])
    console.log(baskets)
    setMyBasket(baskets);
  };

  const fetchBasket = async () => {
    if (!account) return [];
    try {
      const tokenBasketResource = await aptos.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${moduleAddress}::tokenbasket::TokenBasket`,
      });
      setAccountHasBasket(true);
      // tokens table handle
      const tableHandle = (tokenBasketResource as any).data.tokens.handle;
      // tasks table counter
      const tokenCount = (tokenBasketResource as any).data.token_count;

      let tokens = [];
      let counter = 1;
      while (counter <= tokenCount) {
        const tableItem = {
          key_type: "u64",
          value_type: `${moduleAddress}::tokenbasket::Token`,
          key: `${counter}`,
        };
        const token = await aptos.getTableItem<Token>({
          handle: tableHandle,
          data: tableItem,
        });
        tokens.push(token);
        counter++;
      }
      // set tasks in local state
      setTokens(tokens);
    } catch (e: any) {
      setAccountHasBasket(false);
    }
  };

  const addNewBasket = async () => {
    if (!account) return [];
    setCreateBtnActive(true);
    // setPurpleBox(true);
    setTransactionInProgress(true);
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::tokenbasket::create_basket`,
        functionArguments: [],
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });
      setAccountHasBasket(true);
    } catch (error: any) {
      setAccountHasBasket(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, [account?.address]);
  return (
    <>
      tokens:{tokens}
      {/* {counter} */}
      <div className="wrapper">
        <div className="leftt"></div>
        <div className="centter">
          <div className="header">
            <div className="logo"></div>
            <h1 className="heading">Cupcake Finance</h1>
          </div>
          <div className="below-header">
            <h5>Hi {account ? account.address : "User"},</h5>
            <h1>
              Welcome Back!
              <img src={hi} />
            </h1>
          </div>
          <div className="center-main">
            <div className="center-left">
              {!accountHasBasket && !createBtnActive && (
                <div className="create-basket">
                  <div className="left">
                    <h2>Create a Token Basket</h2>
                    <h5>
                      Create and manage Token Baskets and onboard capital easily
                    </h5>
                    <Button onClick={addNewBasket} block type="primary">
                      + Create
                    </Button>
                  </div>

                  <div className="right"></div>
                </div>
              )}
              <br />
              {createBtnActive && (
                <div className="form">
                  <Form name="create basket" layout="vertical">
                    <Form.Item
                      label="Set Token Ratios"
                      name="requiredMarkValue"
                    >
                      <Radio.Group>
                        <Radio.Button onClick={selectUSDT} value={1}>
                          USDT
                        </Radio.Button>
                        <Radio.Button onClick={selectBTC} value={2}>
                          BTC
                        </Radio.Button>
                        <Radio.Button onClick={selectAPT} value={3}>
                          APT
                        </Radio.Button>
                      </Radio.Group>
                      <Radio.Group>
                        <Radio.Button value={0}>{usdtRatio}%</Radio.Button>
                        <Radio.Button value={0}>{btcRatio}%</Radio.Button>
                        <Radio.Button value={0}>
                          {100 - usdtRatio - btcRatio}%
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>

                    {usdtSlider && (
                      <Form.Item>
                        <Slider
                          min={0}
                          max={100}
                          onChange={onChangeUSDT}
                          value={typeof usdtRatio === "number" ? usdtRatio : 0}
                        />
                        <Button onClick={submitUSDTRatio}>
                          Set USDT Ratio
                        </Button>
                      </Form.Item>
                    )}
                    {btcSlider && (
                      <Form.Item>
                        <Slider
                          min={0}
                          max={100}
                          onChange={onChangeBTC}
                          value={typeof btcRatio === "number" ? btcRatio : 0}
                        />
                        <Button onClick={submitBTCRatio}>Set BTC Ratio</Button>
                      </Form.Item>
                    )}
                    {aptSlider && (
                      <Form.Item>
                        <Slider
                          min={0}
                          max={100}
                          // onChange={onChangeAPT}
                          value={
                            100 - usdtRatio - btcRatio >= 0
                              ? 100 - usdtRatio - btcRatio
                              : 0
                          }
                          disabled={true}
                        />
                        <Button onClick={submitAPTRatio}>Set APT Ratio</Button>
                      </Form.Item>
                    )}

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={submitBasket}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}
              <br />
              <h3>Explore our curated baskets</h3>
              <h6>
                Don't want to create a basket from scratch? Choose from our
                pre-made collection
              </h6>
              <div className="container">
                <div>
                  <div className="content">
                    <h2>Jane Doe</h2>
                    <span>UI & UX Designer</span>
                  </div>
                </div>
                <div>
                  <div className="content">
                    <h2>Alex Smith</h2>
                    <span>CEO Expert</span>
                  </div>
                </div>
                <div>
                  <div className="content">
                    <h2>Emily New</h2>
                    <span>Web Designer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="center-right">
              <h2>My Baskets</h2>
              <div className="my-baskets">
                {myBaskets.map(function (object, i) {
                  return (
                    <div className="my-baskets-card">
                      <h2>Basket {i+1}</h2>
                      USDT:{object[0]}%<br />
                      BTC:{object[1]}%<br />
                      APT:{object[2]}%<br />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* <Spin
            spinning={transactionInProgress}
            style={{ background: "none !important" }}
          > */}

          {/* </Spin> */}
        </div>
        <div className="rightt">
          <WalletSelector />
          <div className="profile"></div>
        </div>
      </div>
    </>
  );
}

export const aptos = new Aptos();
// change this to be your module account address
export const moduleAddress =
  "0xa6a027fca5e5e2f426fca74deda89b4530c48a908af7710fd8d36a550ab22cb9";

export default App;

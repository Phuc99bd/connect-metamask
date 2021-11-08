import { Button, Box, Text } from "@chakra-ui/react";
import Identicon from "./Identicon";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Injected } from '../connectors'
import Web3 from 'web3';
import Web3Modal from "web3modal";

type Props = {
  handleOpenModal: any;
};

const RPCURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

export default function ConnectButton({ handleOpenModal }: Props) {
  const [isProcessing , setIsProcessing] = useState(false);
  const [account , setAccount] = useState("");

  let web3 = new Web3(RPCURL);

  const providerOptions = {
    /* See Provider Options Section */
  };
  
  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });
  

  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
      const balance: any =  account ? await web3.eth.getBalance(account) : null;
      if(balance){
        setBalance(+web3.utils.fromWei(balance));
      }
  }

  useEffect(() => {
    getBalance()
  } , [account])

  useEffect(()=> {
    console.log(`account`, account);
  }, [account])

  const onClickSendTransaction = async () => {
    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    try {
      const result = await web3.eth.sendTransaction({
        from: account,  
        to: "0xE5d2213F6065dd554e42919bc12A6B9B19052E0D",
        value: web3.utils.toWei("0.05" , "ether")
      })
      console.log(result);

    } catch (error) {
      console.log(error);
      
    }
  } 

  const onConnection = async () => {
    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts.length > 0 ? accounts[0] : "";
    setAccount(accounts.length > 0 ? accounts[0] : "")
  }

  return account ? (<>
  
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {balance && (balance).toFixed(3)} BNB
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: "gray.700",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
        <Identicon />
      </Button>
    </Box>
    <Button bg="gray.800"
      onClick={onClickSendTransaction}
    >
          Send transaction
    </Button>
    </>
  ) : (
    <Button
    onClick={onConnection}
      bg="blue.800"
      color="blue.300"
      fontSize="lg"
      fontWeight="medium"
      borderRadius="xl"
      border="1px solid transparent"
      _hover={{
        borderColor: "blue.700",
        color: "blue.400",
      }}
      _active={{
        backgroundColor: "blue.800",
        borderColor: "blue.700",
      }}
    >
      Connect to a wallet
    </Button>
  );
}

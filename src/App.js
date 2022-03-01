import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import { ethers } from 'ethers';
import {useState} from 'react';
import Navbar from './Navbar';
import OrganizeMeet from './OrganizeMeet';
import {nftaddress} from './config.js'
import Menu from './Menu';
import Index_Home from './Index_Home';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
 function App() {
  
 // const [name,setname]=useState();
  //const [symbol,setsymbol]=useState();
  const[account,setaccount]=useState();
  //const[balance,setbalance]=useState();
 
    async function getAddress()
    {
      console.log("Hello")
      const [account]= await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftaddress, NFT.abi, signer);
   
     // const balance= await contract.balanceOf(account)
   //  console.log(account)
      console.log(contract)
     //const TokenSynbol=await contract.symbol()
      //const TokenName=await contract.name()
     //console.log(TokenName)
      //console.log(TokenSynbol)
      //setname(TokenName)
      //setsymbol(TokenSynbol)
      setaccount(account)
      //setbalance(balance.toString())
    }
    
    getAddress();
  
  return (
    <>
    <Router>
      <div className="App">
      <Navbar account={account}/>
      <Menu/>
        <Routes>
         <Route exact path="/" element={<Index_Home/>}/>
          <Route exact path="/organize_meet" element={<OrganizeMeet/>} />
        </Routes>
      </div>
    </Router>
     </>
  );
}

export default App;

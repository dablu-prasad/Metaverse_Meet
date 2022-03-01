/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import React, { Fragment } from "react";

import {
  nftaddress, nftmarketaddress
} from './config'

import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import MetaverseMeet from './artifacts/contracts/MetaverseMeet.sol/MetaverseMeet.json'

function Index_Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [setjoin,upjoin]=useState();
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/e55b832a28fc45498b65d1e91a2b9b4f")
    //await window.ethereum.request({ method: 'eth_requestAccounts' })
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, MetaverseMeet.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri);
      let item = {
        tokenId: i.tokenId.toNumber(),
        organizer: meta.data.organizer,
        guest: meta.data.guest,
        time: meta.data.time,
        topic: meta.data.topic,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  
    //console.log(acc)
    async function joinmeet()
    {
       console.log("You joined meeting")
       
    
    }
 
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
 
 return(
  <div className='app-container'>  
  
  {setjoin}
  
   <h2>List of Scheduled Meeting</h2> 
   <form>
   <table className="table table-bordered">
  
    <thead className="thead-dark">
    <tr>
      <th>TokenId</th>
      <th>Organizer</th>
      <th>Guest</th>
      <th>Time</th>
      <th>Topic</th>
      <th>Join</th>
    </tr>
  </thead>
  
{ nfts.map((nft,i)=>{
  return(
    <Fragment>
     <tbody>
    <tr>
    <th key={i}>{nft.tokenId}</th>
      <td>{nft.organizer}</td>
      <td>{nft.guest}</td>
      <td>{nft.time}</td>
      <td>{nft.topic}</td>
      <td><button type="button" className="btn btn-primary" onClick={()=>upjoin(<h1 class="note">You joined the meeting with {nft.guest}</h1>)}>Join Meeting</button></td>
      </tr>
      </tbody>
      </Fragment>
      
  );
})}  
</table>
</form>
</div>  
 )
}

export default Index_Home;
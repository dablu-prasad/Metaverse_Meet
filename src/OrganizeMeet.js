import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import MetaverseMeet from './artifacts/contracts/MetaverseMeet.sol/MetaverseMeet.json'
import { useState } from "react";
import { ethers } from "ethers";
import {nftaddress,nftmarketaddress} from './config.js'
import Home from "./Home"
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


 function CreateItem() {
    const [formInput, updateFormInput] = useState({ organizer: '', guest: '',time:'',topic:'' })
   
      async function createMarket() {
        const { organizer, guest,time,topic } = formInput

        if (!organizer || !guest || !time || !topic) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
          organizer, guest,time,topic
        })
        try {
          const added = await client.add(data)
          const url = `https://ipfs.infura.io/ipfs/${added.path}`
          /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
          createSale(url)
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
        clearText() ;
      }

      function clearText()  
    {
        document.getElementById('i1').value = "";
        document.getElementById('i2').value = "";
        document.getElementById('i3').value = "";
        document.getElementById('i4').value = "";
    } 

      async function createSale(url) {
         await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);   
        const signer = provider.getSigner()
        console.log(url)
        
        /* next, create the item */
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(url)
        console.log(transaction)
        console.log(transaction.value.toNumber())
       // let tokenId = transaction.value.toNumber()
        let tx = await transaction.wait()
        console.log(tx)


        
        let event = tx.events[0]
        console.log(event)
        let value = event.args[2]
        let tokenId = value.toNumber()
      
        /* then list the item for sale on the marketplace */
        contract = new ethers.Contract(nftmarketaddress, MetaverseMeet.abi, signer)
       console.log(contract)

       console.log(formInput)

      //  const organizer = ethers.utils.parseUnits(formInput.organizer);
      //  const guest = ethers.utils.parseUnits(formInput.guest);
      //  const time = ethers.utils.parseUnits(formInput.time);
      //  const topic = ethers.utils.parseUnits(formInput.topic);
       
        transaction = await contract.createMarketItem(nftaddress, tokenId, formInput.organizer,formInput.guest,formInput.time,formInput.topic)
        //await transaction.wait()
      //  router.push('/')
      }
  return (
    <div>
    <Home/>
<div className="mb-3">
<label  className="form-label">OrganizerName:</label>
<input className="form-control" id="i1" onChange={e => updateFormInput({ ...formInput, organizer: e.target.value })} />
</div>
<div className="mb-3">
<label  className="form-label">GuestName:</label>
<textarea  className="form-control" id="i2" onChange={e=>updateFormInput({ ...formInput,guest:e.target.value})}/>
</div>

<div className="mb-3">
<label  className="form-label">Meeting Time:</label>
<textarea  className="form-control" id="i3" onChange={e=>updateFormInput({ ...formInput,time:e.target.value})}/>
</div>

<div className="mb-3">
<label  className="form-label">Topic:</label>
<textarea  className="form-control" id="i4" onChange={e=>updateFormInput({ ...formInput,topic:e.target.value})}/>
</div>

<button onClick={createMarket} className="btn btn-primary" >Schedule Meet</button>
    </div>
  )
}

export default CreateItem;
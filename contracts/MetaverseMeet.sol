// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract MetaverseMeet is ReentrancyGuard
{
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;

  address payable owner;

  constructor()
  {
      owner=payable(msg.sender);
  }

  struct MarketMeet
  {
      uint256 itemId;
      address nftContract;
      uint256 tokenId;
      string  organizer;
      string guest;
      string time;
      string topic;
  }

  mapping (uint256=>MarketMeet) private idToMarketItem;

  event MarketItemCreated(uint256 indexed itemId,address indexed nftContract, uint256 indexed tokenId,
   string Organizer,string guest,string time,string topic);

function createMarketItem(address nftContract,uint256 tokenId,string memory Organizer,string memory guest,
string memory time,string memory topic) public 
{
    _itemIds.increment();
    uint256 itemId=_itemIds.current();
    idToMarketItem[itemId]=MarketMeet(itemId,nftContract,tokenId,Organizer,guest,time,topic);

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(itemId, nftContract, tokenId, Organizer, guest,time,topic);
}

function fetchMarketItems() public view returns (MarketMeet[] memory)
{
    uint itemCount=_itemIds.current();
    uint currentIndex=0;

    MarketMeet[] memory items=new MarketMeet[](itemCount);

    for(uint i=0;i<itemCount;i++)
    {
        // if(idToMarketItem[i+1].owner==address(0))
        // {
            uint currentId=i+1;
            MarketMeet storage currentItem=idToMarketItem[currentId];
            items[currentIndex]=currentItem;
            currentIndex+=1;
       // }
    }
    return items;
}

}
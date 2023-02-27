
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { NFTCard } from "./components/nftCard"

const Home = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const updateWalletAddress = (e) => {
    setWalletAddress(e.target.value);
  }
  const updateCollectionAddress = (e) => {
    setCollectionAddress(e.target.value);
  }
  const fetchNFTs = async () => {
    let nfts;
    console.log("Fetching Nfts");
    const apiKey = "8pbl0VtiJqqktYsOKUrW4NwlQpKHc0gC";
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
    if (!collectionAddress.length) {
      var requestOption = {
        method: 'GET'
      };
      const fetchURL = `${baseURL}?owner=${walletAddress}`;
      nfts = await fetch(fetchURL, requestOption).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
      nfts = await fetch(fetchURL, requestOption).then(data => data.json());
    }
    if (nfts) {
      console.log(nfts);
      setNFTs(nfts.ownedNfts);
      console.log(NFTs);
    }
  }
  const fetchNFTsForCollection = async () => {
    if (collectionAddress.length) {
      const apiKey = "8pbl0VtiJqqktYsOKUrW4NwlQpKHc0gC";
      const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTsForCollection`;
      var requestOption = {
        method: 'GET'
      };
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOption).then(data => data.json());
      console.log(nfts);
      if (nfts) {
        console.log("NFTS in Collection: ", nfts);
        setNFTs(nfts.nfts)
      }
    }
  }
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={updateWalletAddress} type={"text"} value={walletAddress} placeholder='Add your wallet address'></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={updateCollectionAddress} type={"text"} value={collectionAddress} placeholder='Add the collection address'></input>
        <label className="text-gray-600 "><input onChange={(e) => {
          setFetchForCollection(e.target.checked)
        }} type={"checkbox"}></input>Fetch for Collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={() => {
          if (fetchForCollection) {
            fetchNFTsForCollection()
          }
          else {
            fetchNFTs()
          }
        }}>Let's go</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length ? NFTs.map((nft,index) => {
            return (
              <NFTCard key={index} nft={nft}></NFTCard>
            )
          }) : `Please Enter the Address for which you want the NFTs.`
        }

      </div>
    </div>
  )
}

export default Home

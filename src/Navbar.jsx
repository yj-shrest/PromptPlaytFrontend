import { useState, useEffect, use } from 'react';
import { Search, Plus, ChevronRight, User, LogOut } from 'lucide-react';
import { useWallet} from "@solana/wallet-adapter-react";
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getRandomName } from './getRandomName';
const Navbar = () => {
    const {connected,connect,select,disconnect} = useWallet();
    const [showWalletInfo, setShowWalletInfo] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [userName, setUserName] = useState(getRandomName());
    console.log(userName);
    
    console.log(connected);
      const anchorWallet = useAnchorWallet();
      const { connection } = useConnection();
      const { publicKey } = useWallet()
      console.log(publicKey);

    useEffect(() => {
      const fetchBalance = async () => {
        if (publicKey) {
          const lamports = await connection.getBalance(publicKey);
          setUserBalance(lamports / 1e9); // convert lamports to SOL
        }
      };
      fetchBalance();
  }, [publicKey, connection]);
    
      const toggleWalletInfo = () => {
        setShowWalletInfo(!showWalletInfo);
      };
    
      const handleLogout = async () => {
  try {
    await disconnect();
    setShowWalletInfo(false);
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
      const onConnect = async () => {
  select(PhantomWalletName);
  try {
    await connect();
  } catch (err) {
    console.error('Connection error', err);
  }
};

      

  return (
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <button  onClick={() => window.location.href = "/"}>
          <h1  className="text-2xl font-bold">Prompt Play</h1>
            </button>
          <div className="flex space-x-4">
            {connected ? (
              <div className="relative flex">
                <div className="flex items-center space-x-2 mr-4  font-bold text-gray-200">
                  {userName.toUpperCase()}
                </div>
                <button 
                  onClick={toggleWalletInfo}
                  className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition"
                >
                  <User size={20} />
                </button>
                
                {showWalletInfo && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg p-4 z-10">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-700">Wallet Address</h3>
                      <p className="text-sm break-all">{publicKey.toBase58()}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-700">Balance</h3>
                      <p className="text-lg font-semibold">{userBalance || '0'} SOL</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center justify-center"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="px-4 py-2 bg-sky-500 rounded-md hover:bg-purple-600 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>
  )
}

export default Navbar

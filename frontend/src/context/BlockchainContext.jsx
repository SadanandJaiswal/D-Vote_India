import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from 'axios';
import contractJson from "../contract/AadhaarVoting.json";

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [user, setUser] = useState(null);
    const [contract, setContract] = useState(null);
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    const checkWalletConnect = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        }
    };

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
            } else {
                alert("Please install MetaMask");
            }
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    };

    const fetchUserByWallet = async (wallet) => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/user/details?wallet=${wallet}`
            );
            const {dob, name, state} = res.data;
            setUser({dob, name, state});
        } catch (error) {
            console.log("Error Fetching User...", error);
            setUser(null); // No user found → user is not registered
        }
    };

    const loadBlockchain  = async () => {
        if (window.ethereum && walletAddress) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(contractAddress, contractJson.abi, signer);
          setContract(contractInstance);
        }
      };

    useEffect(() => {
        checkWalletConnect();

        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    }, []);

    useEffect(() => {
        if (walletAddress) {
            fetchUserByWallet(walletAddress);
            loadBlockchain();
        }
    }, [walletAddress]);

    return (
        <BlockchainContext.Provider
            value={{ walletAddress, user, setUser, contract, adminAddress, connectWallet, fetchUserByWallet }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchain = () => useContext(BlockchainContext);

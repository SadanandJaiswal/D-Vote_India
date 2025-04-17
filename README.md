# D-Vote India
Aadhaar-based decentralized voting system built using Ethereum blockchain and MERN stack — designed to enhance security, transparency, and accessibility in state and general elections in India.

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Blockchain:** Ethereum, Solidity, Hardhat, MetaMask, Ethers.js
- **Authentication:** Aadhaar API (OTP-based), JWT
- **Database:** MongoDB

## 🚀 Features

- 🔐 **Aadhaar OTP Authentication:** Verifies each voter via Aadhaar-linked OTP, ensuring only eligible and unique users can cast their vote.
- 🧾 **Immutable Voting Logic:** All critical data like votes, voter status, and candidates are stored on Ethereum blockchain for complete transparency.
- ⚡ **Fast Voting Workflow:** Allows users to connect via MetaMask and cast their vote within the allocated voting period, offering a faster and smoother experience than traditional EVM systems.
- 🔍 **Secure Off-chain Storage:** Voter metadata and non-sensitive election details are securely stored in MongoDB.
- ⚙️ **Admin Features:** Admins can create elections, add candidates, and monitor results.
- 💼 **Tamper-Proof Architecture:** Prevents double voting, EVM manipulation, and manual fraud through a decentralized and secure design.

## ⚙️ Prerequisites

- Node.js and npm
- MongoDB instance (local or Atlas)
- MetaMask browser extension
- Aadhaar API access (for OTP auth)
- Hardhat (for local Ethereum blockchain)

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/SadanandJaiswal/D-Vote_India.git
cd D-Vote_India
```

Install dependencies for each module:

```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install

# For Aadhaar API
cd ../aadhaar-api
npm install

# For blockchain (smart contract compilation & deployment)
cd ../blockchain
npm install

```

## 🚀 Running the Project

Make sure all required `.env` files are properly configured for each module before running the project.


### 🧩 Step-by-Step (Use Separate Terminals for Each Step)

#### 🖥️ Terminal 1 – Start the Backend Server

```bash
cd backend
npm start
```

#### 🖥️ Terminal 2 – Start the Aadhaar API Server

```bash
cd aadhaar-api
npm start
```

#### 🖥️ Terminal 3 – Run Local Blockchain (Hardhat)

```bash
cd blockchain
npx hardhat node
```

#### 🖥️ Terminal 4 – Deploy Smart Contracts
In a separate terminal (while the Hardhat node is running):

```bash
cd blockchain
npx hardhat deploy --network localhost
```

#### 🖥️ Terminal 5 – Start the Frontend App

```bash
cd frontend
npm run dev
```

### 🦊 **MetaMask Setup**
---
1. Open **MetaMask** and connect to:  
   `http://localhost:8545`
2. Import accounts using private keys provided by **Hardhat** (from **Terminal 3**).
3. Update the **contract address** in:  
   `/frontend/src/context/BlockchainContext.jsx`  
   → Set the `**contractAddress**` variable to the deployed address from **Terminal 4**.


### 📝 **User Flow: Registration & Voting**
---
After running all the servers and setting the contract address:

#### **1. Register as a Voter**
- Connect your **MetaMask** wallet.
- Enter your **Aadhaar number**.
- An **OTP** will be sent (via the simulated `aadhaar-api`).
- Verify the **OTP**.
- On successful verification, the user is **registered** and eligible to **vote**.

#### **2. Voting Process**
- Go to the **Election Page**.
- Select an **election** and cast your **vote**.

#### **3. Admin Access**
- The **Admin** can:
  - Create new **elections**.
  - Manage existing **elections**.
  - Add or remove **candidates**.



## 👨‍💻 Author

Made with ❤️ by [Sadanand Jaiswal](https://github.com/SadanandJaiswal)

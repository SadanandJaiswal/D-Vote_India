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
npx hardhat run scripts/deploy.js --network localhost
```

#### 🖥️ Terminal 5 – Start the Frontend App

```bash
cd frontend
npm run dev
```

## 🦊 MetaMask Setup

- Connect MetaMask to `http://localhost:8545`
- Import accounts using the private keys from Hardhat (shown in Terminal 3)
- Ensure the correct contract address is used in frontend config


## 👨‍💻 Author

Made with ❤️ by [Sadanand Jaiswal](https://github.com/SadanandJaiswal)

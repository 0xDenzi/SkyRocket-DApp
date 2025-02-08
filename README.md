# SkyRocket DApp

SkyRocket is a decentralized crowdfunding platform designed to fund innovative and groundbreaking projects through blockchain technology. It operates by allowing individuals to contribute either Ether, which is automatically converted into USDC, or directly using stablecoins such as DAI, USDT, and USDC. Contributors are awarded SKT Tokens, which serve as governance tokens, enabling them to vote on which projects should receive funding. The platform aims to bridge the gap between project seekers needing financial support and funders looking to invest in new and exciting ventures while having a say in the ecosystem's governance.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Decentralized Funding:** Facilitate funding for projects using Ether and stablecoins.
- **Governance Mechanism:** Empower contributors with SKT Tokens to participate in project selection and protocol decisions.
- **Transparent Operations:** Ensure all transactions and governance activities are recorded on the blockchain for transparency and security.

## Architecture

The SkyRocket DApp is structured into three main components:

1. **Smart Contracts:** Located in the `contracts` directory, these define the core logic of the platform, including funding mechanisms, token minting, and governance functionalities. The contracts are written and tested using Foundry.

2. **Frontend Application:** Found in the `frontend` directory, this React-based application provides users with an intuitive interface to interact with the platform.

3. **Backend Server:** Situated in the `server` directory, this Node.js server handles off-chain operations, such as user authentication and data storage.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js (v14.x or later):** [Download Node.js](https://nodejs.org/)
- **npm (v6.x or later):** Comes bundled with Node.js.
- **Foundry:** For smart contract development and testing.

  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```

- **MetaMask:** Browser extension for Ethereum wallet management.

  [Download MetaMask](https://metamask.io/)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/0xDenzi/SkyRocket-DApp.git
   cd SkyRocket-DApp
   ```

2. **Install Dependencies:**

   Navigate to each component's directory and install the required packages.

   - **Contracts:**

     ```bash
     cd contracts
     npm install
     ```

   - **Frontend:**

     ```bash
     cd ../frontend
     npm install
     ```

   - **Server:**

     ```bash
     cd ../server
     npm install
     ```

## Configuration

1. **Smart Contracts:**

   - **Network Configuration:** The smart contracts are deployed on the Sepolia Testnet. Update the `.env` file with the correct RPC URL and private key for deployment.

2. **Frontend Application:**

   - **Environment Variables:** Create a `.env` file in the `frontend` directory with the following variables:

     ```env
     REACT_APP_CONTRACT_ADDRESS=<Deployed_Contract_Address>
     REACT_APP_NETWORK_ID=<Network_ID>
     ```

     Replace `<Deployed_Contract_Address>` with the address of the deployed smart contract and `<Network_ID>` with the corresponding network ID (e.g., `11155111` for Sepolia).

3. **Backend Server:**

   - **Environment Variables:** Create a `.env` file in the `server` directory with the necessary configurations, such as database connection strings and API keys.

## Running the Application

1. **Deploy Smart Contracts Using Foundry:**

   In the `contracts` directory, compile and deploy the contracts to Sepolia.

   ```bash
   forge build
   forge script script/Deploy.s.sol:Deploy --rpc-url <SEPOLIA_RPC_URL> --private-key <YOUR_PRIVATE_KEY> --broadcast
   ```

2. **Start the Backend Server:**

   In the `server` directory, start the Node.js server.

   ```bash
   npm start
   ```

3. **Start the Frontend Application:**

   In the `frontend` directory, run the React application.

   ```bash
   npm start
   ```

   The application will be accessible at `http://localhost:3000`.

## Testing

1. **Smart Contract Tests:**

   In the `contracts` directory, run the Foundry tests.

   ```bash
   forge test
   ```

   No frontend or backend tests are currently available.

## Deployment

To deploy the application to a live network:

1. **Smart Contracts:**

   - Update the `.env` file with the correct RPC URL and deployer wallet private key.

   - Deploy the contracts:

     ```bash
     forge script script/Deploy.s.sol:Deploy --rpc-url <SEPOLIA_RPC_URL> --private-key <YOUR_PRIVATE_KEY> --broadcast
     ```

2. **Frontend Application:**

   - Build the React application:

     ```bash
     npm run build
     ```

   - Deploy the build artifacts to your hosting provider of choice.

3. **Backend Server:**

   - Ensure the server is configured for production and deploy it to your hosting environment.

## Contributing

We welcome contributions to enhance the SkyRocket DApp. To contribute:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them with descriptive messages.

4. Push to your forked repository:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request detailing your changes.

## License

This project is licensed under the MIT License.
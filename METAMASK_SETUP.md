# Quick MetaMask Setup Guide

## Step 1: Install MetaMask Extension
- Chrome: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/
- Edge: https://microsoftedge.microsoft.com/addons/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn

## Step 2: Add Hardhat Network to MetaMask

1. Click MetaMask icon → **Settings** (gear icon)
2. Click **Networks** → **Add Network** → **Add a network manually**
3. Fill in these details:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://localhost:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
4. Click **Save**

## Step 3: Import Account from Hardhat

1. In Terminal 1 (where Hardhat node is running), find Account #0:
   ```
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

2. Copy the **Private Key** (the long hex string)

3. In MetaMask:
   - Click account icon (top right)
   - Click **Import Account**
   - Paste the private key
   - Click **Import**

## Step 4: Switch to Hardhat Network

1. Click network dropdown (top of MetaMask, usually shows "Ethereum Mainnet")
2. Select **Hardhat Local**

## Step 5: Connect in App

1. Refresh your frontend page (http://localhost:3000)
2. Click **"Connect Wallet"** button
3. MetaMask will pop up asking to connect
4. Click **Connect** or **Next** → **Connect**

## Troubleshooting

**"Please install MetaMask" error:**
- Make sure MetaMask extension is installed and enabled
- Refresh the browser page
- Check browser console for errors (F12)

**Can't connect:**
- Make sure Hardhat node is running (Terminal 1)
- Make sure you're on "Hardhat Local" network in MetaMask
- Try refreshing the page

**Wrong account:**
- Import Account #0 from Hardhat (it's the Seller account)
- Or import other accounts (Account #1 = Buyer, Account #2 = Registrar, etc.)

## Account Roles Reference

- **Account #0** → Seller (default)
- **Account #1** → Buyer  
- **Account #2** → Registrar
- **Account #3** → Municipal
- **Account #4** → Broker

Import multiple accounts if you want to test different roles!


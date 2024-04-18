// routes/bankDetails.js
const express = require("express");
const router = express.Router();

const { contractABI, web3 } = require('../config');

// Get network ID
const getNetworkId = async () => {
  try {
    const networkId = await web3.eth.net.getId();
    return networkId;
  } catch (error) {
    console.error("Error getting network ID:", error);
    throw error;
  }
};

// Get contract instance
const getContractInstance = async () => {
  try {
    const networkId = await getNetworkId();
    const deployedNetwork = contractABI.networks[networkId];
    if (!deployedNetwork) {
      throw new Error("Contract not deployed on this network");
    }

    const contractAddress = deployedNetwork.address;

    // Create a contract instance
    const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
    return contract;
  } catch (error) {
    console.error("Error getting contract instance:", error);
    throw error;
  }
};

// Define route to fetch bank details
router.get("/api/bankDetails", async (req, res) => {
  try {
    const contract = await getContractInstance();
    const bankDetails = await contract.methods.getBankDetails().call();
    // res.json(bankDetails);
    res.json({ data: bankDetails });
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/addBankDetails", async (req, res) => {
  try {
    const { bankName, accountNumber, backupAmount } = req.body;

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const gasEstimate = await contract.methods
      .addUserBankDetails(bankName, accountNumber, backupAmount)
      .estimateGas({ from: accounts[0] });

    const gasLimit = gasEstimate * 2;

    await contract.methods
      .addUserBankDetails(bankName, accountNumber, backupAmount)
      .send({ from: accounts[0], gas: gasLimit });

    res.status(200).json({ message: "Bank details added successfully" });
  } catch (error) {
    console.error("Error adding bank details:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/addBankDetails1", async (req, res) => {
  try {
    const { bankName, accountNumber, backupAmount } = req.body;

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const gasEstimate = await contract.methods
      .addUserBankDetails(bankName, Number(accountNumber), Number(backupAmount))
      .estimateGas({ from: accounts[0] });
    const gasLimit = gasEstimate * 2;
    await contract.methods
      .addUserBankDetails(bankName, Number(accountNumber), Number(backupAmount))
      .send({ from: accounts[0], gas: gasLimit });

    res.status(200).json({ message: "Bank details added successfully" });
  } catch (error) {
    console.error("Error adding bank details:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/api/updateBank/:bankId", async (req, res) => {
  try {
    const { bankId } = req.params;
    const { bankName, accountNumber, backupAmount } = req.body;

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const gasEstimate = await contract.methods
      .updateBank(bankId,bankName, accountNumber, backupAmount)
      .estimateGas({ from: accounts[0] });
    const gasLimit = gasEstimate * 2;
    await contract.methods
      .updateBank(bankId, bankName, accountNumber, backupAmount)
      .send({ from: accounts[0], gas: gasLimit });

    res.status(200).json({ message: "Bank details added successfully" });
  } catch (error) {
    console.error("Error adding bank details:", error);
    res.status(500).json({ error: error.message });
  }
});

//delete
router.delete("/api/deleteBank/:bankId", async (req, res) => {
  try {
    const { bankId } = req.params;

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const gasEstimate = await contract.methods
      .deleteBank(bankId)
      .estimateGas({ from: accounts[0] });
    const gasLimit = gasEstimate * 2;
    await contract.methods
      .deleteBank(bankId)
      .send({ from: accounts[0], gas: gasLimit });

    res.status(200).json({ message: "Bank deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank:", error);
    res.status(500).json({ error: error.message });
  }
});
// Define route to fetch bank details
router.get("/", async (req, res) => {
  try {
    const contract = await getContractInstance();
    const bankDetails = await contract.methods.getBankDetails().call();
    res.json(bankDetails);
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

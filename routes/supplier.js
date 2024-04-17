const express = require("express");
const router = express.Router();

const { contractABI, web3 } = require('../config');

// Get network ID
const getNetworkId = async () => {
  try {
    const networkId = await web3.eth.net.getId();
    console.log("Network ID:", networkId);
    return networkId;
  } catch (error) {
    console.error("Error getting network ID:", error);
    throw error;
  }
};

const getContractInstance = async () => {
  try {
    const networkId = await getNetworkId();
    const deployedNetwork = contractABI.networks[networkId];
    if (!deployedNetwork) {
      throw new Error("Contract not deployed on this network");
    }

    const contractAddress = deployedNetwork.address;
    console.log("Contract Address:", contractAddress);

    const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
    return contract;
  } catch (error) {
    console.error("Error getting contract instance:", error);
    throw error;
  }
};

router.get("/api/getSupplierDetails", async (req, res) => {
    try {
      const contract = await getContractInstance();
      const supplierDetails = await contract.methods.getAllSuppliersDetails().call();
      res.json({ data: supplierDetails });
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post("/api/addSupplier", async (req, res) => {
    try {
      const { supplierName,supplierNumber, supplierBankName, supplierAccountNumber,supplierSortCode } = req.body;
  
      const contract = await getContractInstance();
      const accounts = await web3.eth.getAccounts();
        
      const gasEstimate = await contract.methods
        .addSupplier(supplierName,supplierNumber, supplierBankName, supplierAccountNumber,supplierSortCode)
        .estimateGas({ from: accounts[0] });
      const gasLimit = gasEstimate * 2;
      await contract.methods
      .addSupplier(supplierName,supplierNumber, supplierBankName, supplierAccountNumber,supplierSortCode)
        .send({ from: accounts[0], gas: gasLimit });
  
      res.status(200).json({ message: "Supplier details added successfully" });
    } catch (error) {
      console.error("Error adding supplier details:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
  router.put("/api/updateSupplier/:supplierId", async (req, res) => {
    try {
      const { supplierId } = req.params;
      const { supplierName,supplierNumber, supplierBankName, supplierAccountNumber,supplierSortCode } = req.body;
  
      const contract = await getContractInstance();
      const accounts = await web3.eth.getAccounts();
  
      const gasEstimate = await contract.methods
        .updateSupplier(supplierId, supplierName,supplierNumber, supplierBankName, supplierAccountNumber,supplierSortCode)
        .estimateGas({ from: accounts[0] });
      const gasLimit = gasEstimate * 2;
      await contract.methods
      .updateSupplier(supplierId, supplierName,supplierNumber, supplierBankName, supplierAccountNumber,supplierSortCode)
        .send({ from: accounts[0], gas: gasLimit });
  
      res.status(200).json({ message: "Supplier details added successfully" });
    } catch (error) {
      console.error("Error adding supplier details:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  //delete
  router.delete("/api/deleteSupplier/:supplierId", async (req, res) => {
    try {
      const { supplierId } = req.params;
  
      const contract = await getContractInstance();
      const accounts = await web3.eth.getAccounts();
  
      const gasEstimate = await contract.methods
        .deleteSupplier(supplierId)
        .estimateGas({ from: accounts[0] });
      const gasLimit = gasEstimate * 2;
      await contract.methods
      .deleteSupplier(supplierId)
        .send({ from: accounts[0], gas: gasLimit });
  
      res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
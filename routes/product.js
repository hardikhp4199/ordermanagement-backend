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

router.get("/api/getProducts", async (req, res) => {
    try {
      const contract = await getContractInstance();
      const productDetails = await contract.methods.viewAllProducts().call();
      res.json({ data: productDetails });
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ error: error.message });
    }
  });

router.post("/api/add/product", async (req, res) => {
    try {

        const { productName, productPrice, productQty } = req.body;

        const contract = await getContractInstance();
        const accounts = await web3.eth.getAccounts();
        
        const gasEstimate = await contract.methods
        .addProduct(productName, parseInt(productPrice), parseInt(productQty))
        .estimateGas({ from: accounts[0] });
        const gasLimit = gasEstimate * 2;
        await contract.methods
        .addProduct(productName, parseInt(productPrice), parseInt(productQty))
        .send({ from: accounts[0], gas: gasLimit });

        res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product details:", error);
        res.status(500).json({ error: error.message });
    }
});
  
router.put("/api/update/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productPrice, productQty } = req.body;

        const contract = await getContractInstance();
        const accounts = await web3.eth.getAccounts();
        
        const gasEstimate = await contract.methods
        .updateProduct(productId,productName, parseInt(productPrice), parseInt(productQty))
        .estimateGas({ from: accounts[0] });
        
        const gasLimit = gasEstimate * 2;
        
        await contract.methods
        .updateProduct(productId, productName, parseInt(productPrice), parseInt(productQty))
        .send({ from: accounts[0], gas: gasLimit });

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error adding product details:", error);
        res.status(500).json({ error: error.message });
    }
});

//delete
router.delete("/api/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
    
        const contract = await getContractInstance();
        const accounts = await web3.eth.getAccounts();
    
        const gasEstimate = await contract.methods
        .deleteProduct(productId)
        .estimateGas({ from: accounts[0] });

        const gasLimit = gasEstimate * 2;
        
        await contract.methods
        .deleteProduct(productId)
        .send({ from: accounts[0], gas: gasLimit });
    
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: error.message });
    }
    });
module.exports = router;
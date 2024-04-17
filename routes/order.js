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

router.post("/api/order/received", async (req, res) => {
  try {
    const { orderNo, receivedOrderProductDetails } = req.body;

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const receivedProducts = JSON.parse(receivedOrderProductDetails);

    const jsonData = {
      "orderNo": 1,
      "receivedProducts": [
        {
          "productId": 1,
          "productQtyOrder": 100,
          "productQtyReceived": 100,
          "productPrice": 20
        },
        {
          "productId": 2,
          "productQtyOrder": 100,
          "productQtyReceived": 100,
          "productPrice": 20
        },
        {
          "productId": 3,
          "productQtyOrder": 100,
          "productQtyReceived": 100,
          "productPrice": 10
        }
      ]
    };

    contract.getPastEvents('LogDebugMessage', { fromBlock: 0, toBlock: 'latest' }, function(error, events) {
      if (!error) {
          events.forEach(event => {
              console.log("Log message:", event.returnValues.message);
          });
      } else {
          console.error("Error fetching events:", error);
      }
  });

  contract.getPastEvents('LogOrderStatus', { fromBlock: 0, toBlock: 'latest' }, function(error, events) {
    if (!error) {
        events.forEach(event => {
            console.log("LogOrderStatus message:", event.returnValues.message);
        });
    } else {
        console.error("LogOrderStatus Error fetching events:", error);
    }
});
    const gasEstimate = await contract.methods
      .receiveOrder(orderNo, receivedProducts)
      .estimateGas({ from: accounts[0] });

    const gasLimit = gasEstimate * 2;
    console.log("gasLimit: ",gasLimit);

    await contract.methods.
    receiveOrder(orderNo, receivedProducts).send({
      from: accounts[0],
      gas: gasLimit,
    });

    res.status(200).json({ message: "Order Received Successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/order/details", async (req, res) => {
  try {
    const orderDetailsObject = [];

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const orderCount = await contract.methods
    .getPlacedOrderNumbers(accounts[0])
    .call();

    for (let i = 0; i < orderCount.length; i++) {
      const orderDetails = await contract.methods
        .getOrderDetails(accounts[0], orderCount[i])
        .call();
      orderDetailsObject.push(orderDetails);
    }
    res.status(200).json({ data: orderDetailsObject ,message: "Order details get Successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});


router.post("/api/place/order", async (req, res) => {
  try {
    const {  selectedProducts, productQty, supplierId  } = req.body;

    const contract = await getContractInstance();
    const accounts = await web3.eth.getAccounts();

    const gasEstimate = await contract.methods.placeOrder(selectedProducts, productQty,supplierId).estimateGas({ from: accounts[0] });

    const gasLimit = gasEstimate * 2;
    await contract.methods.placeOrder(selectedProducts, productQty,supplierId).send({ from: accounts[0], gas: gasLimit });

    res.status(200).json({ message: "Order added Successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

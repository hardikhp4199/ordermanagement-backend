// Import the smart contract artifacts
const InventoryPayment = artifacts.require("../contract/InventoryPayment");

contract("InventoryPayment", (accounts) => {
    let inventoryPaymentInstance;

    // Before running the tests, deploy the contract
    before(async () => {
        inventoryPaymentInstance = await InventoryPayment.deployed();
    });

    
    /********************************* Bank Test Cases Start  ******************************************** */
    // Test case for adding a bank with valid parameters
    it("should add a bank with valid parameters", async () => {
        await inventoryPaymentInstance.addUserBankDetails(
            "Bank A",
            1234567890,
            1000000,
            { from: accounts[0] }
        );

        const bankDetails = await inventoryPaymentInstance.getBankDetails();
        assert.equal(bankDetails[0].bankName, "Bank A", "Bank name should match");
    });

    // // Test case for adding a bank with empty name
    it("should not add a bank with empty name", async () => {
        try {
            await inventoryPaymentInstance.addUserBankDetails(
                "",
                1234567890,
                1000000,
                { from: accounts[0] }
            );
        } catch (error) {
            assert(error.message.includes("Bank name cannot be empty"), "Error message should include 'Bank name cannot be empty'");
            return;
        }
        assert(false, "Adding bank with empty name should throw an error");
    });

    // Test case for getting bank details
    it("should get bank details", async () => {
        const bankDetails = await inventoryPaymentInstance.getBankDetails();
        
        assert.equal(bankDetails[0].bankName, "Bank A", "Bank name should match");
        assert.equal(bankDetails[0].bankAccountNumber, 1234567890, "Bank account number should match");
        assert.equal(bankDetails[0].backupAmount, 1000000, "Backup amount should match");
    });

    // // Test case for updating bank details
    it("should update bank details", async () => {
        await inventoryPaymentInstance.updateBank(
            1, // Bank ID
            "Bank C",
            1357924680,
            1500000, // New backup amount
            { from: accounts[0] }
        );

        const bankDetails = await inventoryPaymentInstance.getBankDetails();
        assert.equal(bankDetails[0].bankName, "Bank C", "Updated bank name should match");
        assert.equal(bankDetails[0].bankAccountNumber, 1357924680, "Updated bank account number should match");
        assert.equal(bankDetails[0].backupAmount, 1500000, "Updated backup amount should match");
    });
    /********************************* Bank Test Cases End  ******************************************** */



    /********************************* Supplier Test Cases Start  ******************************************** */
    
    // // Test case for adding a supplier with valid parameters
    it("should add a supplier with valid parameters", async () => {
        await inventoryPaymentInstance.addSupplier(
            "Supplier 1",
            "1234567890",
            "Bank A",
            "123456",
            1234567890,
            { from: accounts[0] }
        );

        const supplier = await inventoryPaymentInstance.suppliers(1);
        assert.equal(supplier.supplierName, "Supplier 1", "Supplier name should match");
    });

    // // Test case for adding a supplier with empty name
    it("should not add a supplier with empty name", async () => {
        try {
            await inventoryPaymentInstance.addSupplier(
                "",
                "1234567890",
                "Bank A",
                "123456",
                1234567890,
                { from: accounts[0] }
            );
        } catch (error) {
            assert(error.message.includes("Supplier name cannot be empty"), "Error message should include 'Supplier name cannot be empty'");
            return;
        }
        assert(false, "Adding supplier with empty name should throw an error");
    });    

    // Test case for updating supplier details
    it("should update supplier details", async () => {

        await inventoryPaymentInstance.updateSupplier(
            1, // Supplier ID
            "Gurukrupa Traders",
            "0987654321",
            "Bank B",
            "654321",
            1279102000132,
            { from: accounts[0] }
        );

        const supplier = await inventoryPaymentInstance.suppliers(1);
        assert.equal(supplier.supplierName, "Gurukrupa Traders", "Supplier name should match");
        assert.equal(supplier.supplierNumber, "0987654321", "Supplier number should match");
        assert.equal(supplier.supplierBank.bankName, "Bank B", "Supplier bank name should match");
        assert.equal(supplier.supplierBank.sortCode, "654321", "Supplier bank sort code should match");
        assert.equal(supplier.supplierBank.accountNumber, 1279102000132, "Supplier bank account number should match");
    });
    
    // Test case for updating supplier details with empty name
    it("should not update supplier details with empty name", async () => {
        try {
            await inventoryPaymentInstance.updateSupplier(
                1,
                "",
                "0987654321",
                "Bank B",
                "654321",
                9876543210,
                { from: accounts[1] }
            );
        } catch (error) {
            assert(error.message.includes("Supplier name cannot be empty"), "Error message should include 'Supplier name cannot be empty'");
            return;
        }
        assert(false, "Updating supplier with empty name should throw an error");
    });

    // Test case for getting supplier details
    it("should get supplier details", async () => {
        const supplierDetails = await inventoryPaymentInstance.getAllSuppliersDetails();
        assert.equal(supplierDetails[0].supplierName, "Gurukrupa Traders", "Supplier name should match");
        assert.equal(supplierDetails[0].supplierNumber, "0987654321", "Supplier number should match");
        assert.equal(supplierDetails[0].supplierBank.bankName, "Bank B", "Supplier bank name should match");
        assert.equal(supplierDetails[0].supplierBank.sortCode, "654321", "Supplier bank sort code should match");
        assert.equal(supplierDetails[0].supplierBank.accountNumber, 1279102000132, "Supplier bank account number should match");
    });

    /********************************* Supplier Test Cases End  ******************************************** */



    /********************************* Product Test Cases  ******************************************** */
        // Test case for adding multiple products
        it("should add multiple products", async () => {
            await inventoryPaymentInstance.addProduct(
                "Product A",
                100, // Price
                50, // Quantity
                { from: accounts[0] }
            );

            await inventoryPaymentInstance.addProduct(
                "Product B",
                200, // Price
                100, // Quantity
                { from: accounts[0] }
            );

            const productA = await inventoryPaymentInstance.viewProduct(1);
        
            assert.equal(productA.productName, "Product A", "Product A name should match");
            assert.equal(productA.productPrice, 100, "Product A price should match");
            assert.equal(productA.productQty, 50, "Product A quantity should match");

            const productB = await inventoryPaymentInstance.viewProduct(2);
            assert.equal(productB.productName, "Product B", "Product B name should match");
            assert.equal(productB.productPrice, 200, "Product B price should match");
            assert.equal(productB.productQty, 100, "Product B quantity should match");

        });

        // Test case for adding a product with empty name
        it("should not add a product with empty name, price not less then 0 ", async () => {
            try {
                await inventoryPaymentInstance.addProduct(
                    "",
                    50,
                    50,
                    { from: accounts[0] }
                );
            } catch (error) {
                assert(error.message.includes("Product name cannot be less then empty"), "Error message should include 'Product name cannot be empty'");
                return;
            }
            assert(false, "Adding product with empty name should throw an error");
        });

        // // Test case for getting product details
        it("should get product details", async () => {
            const product = await inventoryPaymentInstance.viewProduct(1);
            assert.equal(product.productName, "Product A", "Product name should match");
            assert.equal(product.productPrice, 100, "Product price should match");
            assert.equal(product.productQty, 50, "Product quantity should match");
        });

        // Test case for updating product details
        it("should update product details", async () => {
            await inventoryPaymentInstance.updateProduct(
                1,
                "Updated Product A",
                150,
                75,
                { from: accounts[0] }
            );

            const product = await inventoryPaymentInstance.viewProduct(1);
            assert.equal(product.productName, "Updated Product A", "Updated product name should match");
            assert.equal(product.productPrice, 150, "Updated product price should match");
            assert.equal(product.productQty, 75, "Updated product quantity should match");
        });

        // Test case for updating product details with empty name
        it("should not update product details with empty name", async () => {
            try {
                await inventoryPaymentInstance.updateProduct(
                    1, // Product ID
                    "",
                    150,
                    75,
                    { from: accounts[0] }
                );
            } catch (error) {
                assert(error.message.includes("Product name cannot be empty"), "Error message should include 'Product name cannot be empty'");
                return;
            }
            assert(false, "Updating product with empty name should throw an error");
        });
    /********************************* Product Test Cases  End ******************************************** */

    // Test case for placing an order with valid parameters
    it("should place an order with valid parameters", async () => {
        await inventoryPaymentInstance.placeOrder(
            [1,2],
            [10,10],
            1,
            { from: accounts[0] }
        );

        const orders = await inventoryPaymentInstance.getPlacedOrderNumbers(accounts[0]);
        assert.equal(orders.length, 1, "Order should be placed successfully");
    });

    // // Test case for placing an order with invalid product ID
    it("should not place an order with invalid product ID", async () => {
        try {
            await inventoryPaymentInstance.placeOrder(
                [100],
                [10],
                1,
                { from: accounts[0] }
            );
        } catch (error) {
            assert(error.message.includes("Invalid product ID"), "Error message should include 'Invalid product ID'");
            return;
        }
        assert(false, "Placing order with invalid product ID should throw an error");
    });

    // // Test case for placing an order with invalid supplier ID
    it("should not place an order with invalid supplier ID", async () => {
        try {
            await inventoryPaymentInstance.placeOrder(
                [1,2],
                [10,10],
                100,
                { from: accounts[0] }
            );
        } catch (error) {
            assert(error.message.includes("Invalid supplier ID"), "Error message should include 'Invalid supplier ID'");
            return;
        }
        assert(false, "Placing order with invalid supplier ID should throw an error");
    });

    // Test case for receiving an order with valid parameters
    it("should receive an order with valid parameters", async () => {
        await inventoryPaymentInstance.receiveOrder(
            1,
            [{
                "productId": 1,
                "productQtyOrder": 10,
                "productQtyReceived": 10,
                "productPrice": 100
              },
              {
                "productId": 2,
                "productQtyOrder": 10,
                "productQtyReceived": 10,
                "productPrice": 100
              }],
            { from: accounts[0] }
        );

        const orders = await inventoryPaymentInstance.getOrderDetails(accounts[0],1);
        assert(orders.isReceived, "Order should be marked as received");
        assert.equal(orders.orderStatus, "paid", "Order status should be 'paid'");
    });

    // Test case for receiving an order with invalid order number
    it("should not receive an order with invalid order number", async () => {
        try {
            await inventoryPaymentInstance.receiveOrder(
                100,
                [{
                    "productId": 1,
                    "productQtyOrder": 10,
                    "productQtyReceived": 10,
                    "productPrice": 100
                  }],
                { from: accounts[0] }
            );
        } catch (error) {
            assert(error.message.includes("Order not found or already received"), "Error message should include 'Order not found'");
            return;
        }
        assert(false, "Receiving order with invalid order number should throw an error");
    });
});

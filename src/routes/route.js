const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");

// a. GET /inventory - Retrieve the entire inventory.
router.get("/inventory", inventoryController.getInventory);
// b. GET /inventory/:id - Retrieve a single item from the inventory.
router.get("/inventory/:id", inventoryController.getByIdInventory);
// c. POST /inventory - Add a new item to the inventory.
router.post("/inventory", inventoryController.createInventory);
// d. PUT /inventory/:id - Update an existing item in the inventory.
router.put("/inventory/:id", inventoryController.updateInventory);
// e. DELETE /inventory/:id - Remove an item from the inventory.
router.delete("/inventory/:id", inventoryController.deleteInventory);

module.exports = router;

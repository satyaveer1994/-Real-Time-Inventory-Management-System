const inventoryModel = require("../models/inventoryModel");
//const io = require('socket.io')(http)
// const socketio = require('socket.io');
// const io = socketio(server);

//Add a new item to the inventory.
const createInventory = async (req, res) => {
  try {
    const data = req.body;

    if (Object.keys(data).length === 0) {
      res.status(400).send({ status: false, msg: "please prvide in req.body" });
    }

    const { productName, description, quantity, price } = data;

    if (!productName) {
      res
        .status(400)
        .send({ status: false, msg: "productName is required field" });
    }
    if (!description) {
      res
        .status(400)
        .send({ status: false, msg: "description is required field" });
    }
    if (!quantity) {
      res
        .status(400)
        .send({ status: false, msg: "quantity is required field" });
    }
    if (!price) {
      res.status(400).send({ status: false, msg: "price is required field" });
    }

    const addInventory = await inventoryModel.create(data);
    res
      .status(201)
      .send({
        status: true,
        msg: "Inventory succesfully created",
        data: addInventory,
      });

    io.emit("inventoryAdd", data);
    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.msg });
  }
};

//Retrieve the entire inventory.
const getInventory = async (req, res) => {
  try {
    const data = req.query;
    if (Object.keys(data) == 0)
      return res.status(400).send({ status: false, msg: "No input provided" });

    const product = await inventoryModel.find({
      $and: [data, { isDeleted: false }],
    });

    if (data.length == 0)
      return res.status(404).send({ status: false, msg: "No data Available." });
    return res.status(200).send({ status: true, data: product });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//Retrieve a single item from the inventory
const getByIdInventory = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    // let userIdFromToken = req.userId;
    if (!id) {
      return res
        .status(400)
        .send({ status: false, message: "product_Id required" });
    }

    let productData = await inventoryModel.findById(req.params.id);
    if (!productData) {
      return res
        .status(404)
        .send({
          status: false,
          message: "This product not present in our database",
        });
    }

    let getProductDetails = await inventoryModel.findById(id);

    return res.status(200).send({
      status: true,
      message: "product details",
      data: getProductDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.msg });
  }
};

//Update an existing item in the inventory.
const updateInventory = async (req, res) => {
  try {
    //Validate: The productId is present in request path params or not.
    let id = req.params.id;
    if (!id)
      return res
        .status(400)
        .send({ status: false, msg: "product Id is required" });

    //Validate: The productId is valid or not.
    let product = await inventoryModel.findById(id);
    if (!product)
      return res.status(404).send({ status: false, msg: " does not exists" });

    //Validate: If the productId exists (must have isDeleted false)
    let is_Deleted = product.isDeleted;
    if (is_Deleted == true)
      return res
        .status(404)
        .send({ status: false, msg: "product is already deleted" });

    //Updates a product by changing the its productName, description, adding price,
    let productName = req.body.productName;
    let price = req.body.price;
    let description = req.body.description;
    let quantity = req.body.quantity;
    let updatedProduct = await inventoryModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          productName: productName,
          price: price,
          description: description,
          quantity: quantity,
        },
      },
      { new: true }
    );
    //Sending the updated response
    return res.status(200).send({ status: true, data: updatedProduct });

    // io.emit('inventoryUpdated', updatedProduct);
    // res.status(201).send(updatedProduct);
  } catch (err) {
    console.log("This is the error :", err.message);
    return res
      .status(500)
      .send({ status: false, msg: " Server Error", error: err.message });
  }
};

//Remove an item from the inventory.
const deleteInventory = async (req, res) => {
  try {
    const product = await inventoryModel.findOne({
      _id: product_Id,
      //createdBy: req.user.userId,
    });
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const deleteProduct = await inventoryModel.findByIdAndUpdate(
      product_Id,
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "success", data: deleteProduct });

    // io.emit('inventoryUpdated', inventory);
    // res.status(201).send(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.msg });
  }
};

module.exports = {
  createInventory,
  getInventory,
  getByIdInventory,
  updateInventory,
  deleteInventory,
};

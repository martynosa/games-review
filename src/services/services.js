const itemModel = require('../config/models/item-model');

const getAllItems = () => itemModel.find().lean();

const getSingleItem = (id) => itemModel.findById(id).lean();

const createItem = (itemToCreate) => itemModel.create(itemToCreate);

const deleteItem = (idToDelete) => itemModel.findByIdAndDelete(idToDelete);

const editItem = (id, editedItem) => itemModel.findByIdAndUpdate(id, editedItem, { runValidators: true });

const like = (userId, itemId) => itemModel.findOneAndUpdate({ _id: itemId }, { $push: { likedBy: userId }, $inc: { rating: 1 } });

const isLiked = async (userId, itemId) => {
    const item = await itemModel.findById(itemId);
    return item.likedBy.some(e => e._id == userId);
};

const services = {
    getAllItems,
    getSingleItem,
    createItem,
    deleteItem,
    editItem,
    like,
    isLiked,
}

module.exports = services;
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      res.status(404).json({ msg: `No Document found Delete for this item ` });
    }
    document.remove();
    res.status(204).send("the item was delete successful");
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(
          `No document  found update for this item ${req.params.id}`,
          404
        )
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.creatOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json(newDoc);
  });

exports.getOne = (Modle, populationsOptin) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //Bulid query
    let query = Modle.findById(id);
    if (populationsOptin) {
      query = query.populate(populationsOptin);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(`${Modle} not found for ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.gettAll = (Modle, modelName = "") =>
  asyncHandler(async (req, res) => {
    let Fliter = {};
    if (req.objectForFind) {
      Fliter = req.objectForFind;
    }
    //Builed query
    const documentCount = await Modle.countDocuments();
    const apiFeatures = new ApiFeatures(Modle.find(Fliter), req.query)
      .Pagination(documentCount)
      .sort()
      .LimitingFields()
      .Search(modelName)
      .filter();

    const { paginationResult, mongooseQuery } = apiFeatures;

    //Execute query
    const product = await mongooseQuery;
    res
      .status(200)
      .json({ resultes: product.length, paginationResult, data: product });
  });

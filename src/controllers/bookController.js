const userModel = require("../models/userModel");
const booksModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const moment = require("moment")
const {
  isValid,
  isValidTitle,
  isValidBody,
  validateISBN,
  isValidDate,
} = require("../validator/validator");
const { isValidObjectId } = require("mongoose");

//================================================POST API FOR BOOKS=====================================================================================================================
const createBook = async function (req, res) {
  try {
    const requestBody = req.body;

    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      requestBody;
//=====================================================================Validations=======================================================================================================
    if(!isValidBody(requestBody)){return res.status(400).send({status:false,message:"plz provide request body"})}

    if (!isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide title" });
    }

    const titleUsed = await booksModel.findOne({ title: title });

    if (titleUsed) {
      return res
        .status(400)
        .send({ status: false, message: "This title is already Used" });
    }

    if (!isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide excerpt" });
    }

    if (!isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide ISBN" });
    }

    if(!validateISBN(ISBN)){return res.status(400).send({status:false,message:"plz provide valid ISBN"})}

    const isISBNAlreadyUsed = await booksModel.findOne({ ISBN: ISBN });

    if (isISBNAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN already registered" });
    }

    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide category" });
    }

    if (!isValid(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide subCategory" });
    }

    if(!isValid(releasedAt)){return res.status(400).send({status:false,message:"plz provide realeasedAt"})}

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid userId" });
    }

    if (!isValidDate(releasedAt))
      return res
        .status(400)
        .send({ status: false, message: "Invalid date format!  (valid format : YYYY-MM-DD)" });
         
/**************************************************************************************************************************************************************************************/

const validId = await userModel.findById({ _id: userId }); // Checking if user exists in db or not
    if (!validId) {
      return res
        .status(400)
        .send({ status: false, message: "UserId does not exist" });
    }
    const bookData = await booksModel.create(requestBody); // Creating the book in db
    return res
      .status(201)
      .send({ status: true, message: "Created successfully", data: bookData });
  } catch (err) {
    return res.status(500).send({ status: false, messege: err.message });
  }
};

//=================================================================GET API FOR BOOKS=============================================================================================================
const getBooks = async (req, res) => {
  try {
    let query = req.query;
    if (Object.keys(query).length == 0) {let desiredBooks = await booksModel.find({ isDeleted: false }).collation({ locale: "en" }).sort({ title: 1 });
      return res
        .status(200)
        .send({
          status: true,
          message: "Your data is here",
          data: desiredBooks,
        });
    }
    if (Object.keys(query).length != 0) {  // If we proivdie any query param
      req.query.isDeleted = false;
      let filteredBooks = await booksModel
        .find(req.query)
        .collation({ locale: "en" })
        .sort({ title: 1 });
      if (filteredBooks.length == 0) {
        return res
          .status(404)
          .send({
            status: false,
            message: "No books found with the matching filter",
          });
      } else {
        return res
          .status(200)
          .send({
            status: true,
            message: "We have these books matching with your filters",
            data: filteredBooks,
          });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//*************************************************** GET Books by Id ******************************************************//
const bookById = async function (req, res) {
  try {
    const reqBookId = req.params.bookId;
//                                            //====>> Validations <<==//
    if (!isValid(reqBookId)) {
      return res.status(400).send({ status: false, message: "Please provide bookId" });
    }
    if (!isValidObjectId(reqBookId)) {
      return res.status(400).send({ status: false, message: "Invalid bookId" });
    }                                       //***************************//
    let bookInfo = await booksModel.findOne({
      _id: reqBookId,
      isDeleted: false,
    });
    if (!bookInfo) {
      return res.status(404).send({ status: false, message: "Book not found" });
    }

    let reviewData = await reviewModel.find({
      bookId: reqBookId,
      isDeleted: false,
    });
    const responseData = bookInfo.toObject();
    responseData.reviews = reviewData;

    return res
      .status(200)
      .send({
        status: true,
        message: "Fetching review data successfuly",
        data: responseData,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//****************************************************update book PUT Api****************************************************//

const updateBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let body = req.body;

    if(!isValidBody(body)) return res.status(400).send({status: false, message:"Please provide details in body to update"})
    let { title, excerpt, releasedAt, ISBN } = body;

    if (!isValidObjectId)
      res.status(400).send({ status: false, message: "Invalid bookId" });
    let updatingBook = await booksModel.findById({ _id: bookId });
    if (!updatingBook || updatingBook.isDeleted == true)
      return res.status(404).send({ status: false, message: "Book not found" });

    //---------Checking if body attributes are valid---------//
    if (title)
      if (!isValidTitle(title))
        res.status(400).send({ status: false, message: "Invalid title" });
    if (excerpt)
      if (!isValid(excerpt))
        res.status(400).send({ status: false, message: "Invalid excerpt" });
    if (releasedAt)
      if (!isValidDate(releasedAt))
        res.status(400).send({ status: false, message: "Invalid date format" });
    if (ISBN)
      if (!validateISBN(ISBN))
        res.status(400).send({ status: false, message: "Invalid ISBN" });

    //--------Cheking if body attributes are duplicate---------//
    let duplicateTitle = await booksModel.findOne({ title: title });
    if (duplicateTitle)
      return res
        .status(400)
        .send({ status: false, message: "Title is already in use" });

    let duplicateISBN = await booksModel.findOne({ ISBN: ISBN });
    if (duplicateISBN)
      return res
        .status(400)
        .send({ status: false, message: "ISBN is already in use" });

    let updatedBook = await booksModel.findByIdAndUpdate(
      { _id: bookId },
      { $set: body },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: updatedBook });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// =================> Delete Books by Id <==================================================================
const deleteBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let obj = {}; // creating a new object
    if (!isValidObjectId(bookId)) {
      return res.status(404).send({ status: false, message: "Invalid bookId" });
    } else {
      obj.bookId = req.params.bookId;
    }
    let today = moment().format("YYYY-MM-DD, hh:mm:ss a");

    let findBook = await booksModel.findOneAndUpdate(
      { _id: obj.bookId, isDeleted: false },
      { $set: { isDeleted: true }, deletedAt: today },
      { new: true }
    );
    if (!isValidObjectId(findBook))
      return res.status(404).send({ status: false, message: "No Books Found" });

    res
      .status(200)
      .send({ status: true, message: "Deleted successfully", data: findBook }); // Successful deletion
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createBook, getBooks, bookById, updateBook, deleteBook };
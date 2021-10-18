const get = require("./get-subscription");
const create = require("./create-subscription-contract");
const _delete = require("./delete-subscription-contract");
const getByCustomer = require("./get-by-customer");
const updatePaymentMethod = require("./update-payment-method");

module.exports = {
  get,
  create,
  delete: _delete,
  getByCustomer,
  updatePaymentMethod,
};

const productModel = require('../models/productModel');
const ApiError = require('../utils/ApiError');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout({ items, paymentMethod }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'items must be a non-empty array');
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    throw new ApiError(400, `paymentMethod must be one of: ${VALID_PAYMENT_METHODS.join(', ')}`);
  }

  const lineItems = items.map(({ productId, quantity }) => {
    const product = productModel.findById(productId);
    if (!product) {
      throw new ApiError(404, `Product with id ${productId} not found`);
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError(400, `quantity for product ${productId} must be a positive integer`);
    }

    const lineTotal = Number((product.price * quantity).toFixed(2));
    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal,
    };
  });

  const subtotal = Number(lineItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const discount =
    paymentMethod === 'cash' ? Number((subtotal * CASH_DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number((subtotal - discount).toFixed(2));

  return {
    items: lineItems,
    paymentMethod,
    subtotal,
    discount,
    total,
  };
}

module.exports = {
  checkout,
};

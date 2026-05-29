const { getUser, updateUserAttribute } = require('../utils/dynamodb');
const { success, badRequest, forbidden, serverError } = require('../utils/response');
const { validateUserAccess } = require('../utils/auth');

/**
 * GET /users/{userId}/cart
 * Returns the user's cart items
 */
async function getCart(event) {
  try {
    const { userId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only access your own cart');
    }

    const user = await getUser(userId);
    const cart = user?.cart || [];

    return success({ cart });
  } catch (error) {
    console.error('getCart error:', error);
    return serverError('Failed to get cart');
  }
}

/**
 * POST /users/{userId}/cart
 * Add item to cart: { productId, qty, price }
 */
async function addToCart(event) {
  try {
    const { userId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only modify your own cart');
    }

    const body = JSON.parse(event.body || '{}');
    const { productId, qty, price } = body;

    if (!productId || qty === undefined || price === undefined) {
      return badRequest('Missing required fields: productId, qty, price');
    }

    if (typeof qty !== 'number' || qty < 1) {
      return badRequest('qty must be a positive number');
    }

    if (typeof price !== 'number' || price < 0) {
      return badRequest('price must be a non-negative number');
    }

    const user = await getUser(userId);
    const cart = user?.cart || [];

    // Check if product already exists in cart
    const existingIndex = cart.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].qty = qty;
      cart[existingIndex].price = price;
    } else {
      // Add new item
      cart.push({ productId, qty, price });
    }

    await updateUserAttribute(userId, 'cart', cart);

    return success({ cart });
  } catch (error) {
    console.error('addToCart error:', error);
    return serverError('Failed to add item to cart');
  }
}

/**
 * DELETE /users/{userId}/cart/{productId}
 * Remove item from cart
 */
async function removeFromCart(event) {
  try {
    const { userId, productId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only modify your own cart');
    }

    const user = await getUser(userId);
    const cart = user?.cart || [];

    const updatedCart = cart.filter((item) => item.productId !== productId);

    await updateUserAttribute(userId, 'cart', updatedCart);

    return success({ cart: updatedCart });
  } catch (error) {
    console.error('removeFromCart error:', error);
    return serverError('Failed to remove item from cart');
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};

const { getUser, updateUserAttribute } = require('../utils/dynamodb');
const { success, badRequest, forbidden, serverError } = require('../utils/response');
const { validateUserAccess } = require('../utils/auth');

/**
 * GET /users/{userId}/favorites
 * Returns the user's favorite products
 */
async function getFavorites(event) {
  try {
    const { userId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only access your own favorites');
    }

    const user = await getUser(userId);
    const favorites = user?.favorites || [];

    return success({ favorites });
  } catch (error) {
    console.error('getFavorites error:', error);
    return serverError('Failed to get favorites');
  }
}

/**
 * POST /users/{userId}/favorites
 * Add product to favorites: { productId }
 */
async function addFavorite(event) {
  try {
    const { userId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only modify your own favorites');
    }

    const body = JSON.parse(event.body || '{}');
    const { productId } = body;

    if (!productId) {
      return badRequest('Missing required field: productId');
    }

    const user = await getUser(userId);
    const favorites = user?.favorites || [];

    // Avoid duplicates
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      await updateUserAttribute(userId, 'favorites', favorites);
    }

    return success({ favorites });
  } catch (error) {
    console.error('addFavorite error:', error);
    return serverError('Failed to add favorite');
  }
}

/**
 * DELETE /users/{userId}/favorites/{productId}
 * Remove product from favorites
 */
async function removeFavorite(event) {
  try {
    const { userId, productId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only modify your own favorites');
    }

    const user = await getUser(userId);
    const favorites = user?.favorites || [];

    const updatedFavorites = favorites.filter((id) => id !== productId);

    await updateUserAttribute(userId, 'favorites', updatedFavorites);

    return success({ favorites: updatedFavorites });
  } catch (error) {
    console.error('removeFavorite error:', error);
    return serverError('Failed to remove favorite');
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};

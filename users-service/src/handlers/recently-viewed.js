const { getUser, updateUserAttribute } = require('../utils/dynamodb');
const { success, badRequest, forbidden, serverError } = require('../utils/response');
const { validateUserAccess } = require('../utils/auth');

const MAX_RECENTLY_VIEWED = 10;

/**
 * GET /users/{userId}/recently-viewed
 * Returns the user's recently viewed products (sorted newest to oldest)
 */
async function getRecentlyViewed(event) {
  try {
    const { userId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only access your own recently viewed');
    }

    const user = await getUser(userId);
    const recentlyViewed = user?.recentlyViewed || [];

    return success({ recentlyViewed });
  } catch (error) {
    console.error('getRecentlyViewed error:', error);
    return serverError('Failed to get recently viewed');
  }
}

/**
 * POST /users/{userId}/recently-viewed
 * Add product to recently viewed: { productId }
 * Automatically adds viewedAt timestamp, sorted newest first, max 10 items
 */
async function addRecentlyViewed(event) {
  try {
    const { userId } = event.pathParameters;

    if (!validateUserAccess(event, userId)) {
      return forbidden('You can only modify your own recently viewed');
    }

    const body = JSON.parse(event.body || '{}');
    const { productId } = body;

    if (!productId) {
      return badRequest('Missing required field: productId');
    }

    const user = await getUser(userId);
    let recentlyViewed = user?.recentlyViewed || [];

    // Remove existing entry for this product (if any)
    recentlyViewed = recentlyViewed.filter((item) => item.productId !== productId);

    // Add new entry at the beginning with current timestamp
    const newEntry = {
      productId,
      viewedAt: new Date().toISOString(),
    };

    recentlyViewed.unshift(newEntry);

    // Keep only the most recent MAX_RECENTLY_VIEWED items
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }

    await updateUserAttribute(userId, 'recentlyViewed', recentlyViewed);

    return success({ recentlyViewed });
  } catch (error) {
    console.error('addRecentlyViewed error:', error);
    return serverError('Failed to add recently viewed');
  }
}

module.exports = {
  getRecentlyViewed,
  addRecentlyViewed,
};

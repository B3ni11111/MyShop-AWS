/**
 * Extract userId (sub) from JWT claims in API Gateway event
 */
function getUserIdFromToken(event) {
  const claims = event.requestContext?.authorizer?.claims;
  return claims?.sub || null;
}

/**
 * Validate that the authenticated user matches the requested userId
 */
function validateUserAccess(event, requestedUserId) {
  const tokenUserId = getUserIdFromToken(event);
  return tokenUserId === requestedUserId;
}

module.exports = {
  getUserIdFromToken,
  validateUserAccess,
};

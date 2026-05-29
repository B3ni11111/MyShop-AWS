const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

function success(data) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

function created(data) {
  return {
    statusCode: 201,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

function badRequest(message) {
  return {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  };
}

function forbidden(message = 'Access denied') {
  return {
    statusCode: 403,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  };
}

function notFound(message = 'Not found') {
  return {
    statusCode: 404,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  };
}

function serverError(message = 'Internal server error') {
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  };
}

module.exports = {
  success,
  created,
  badRequest,
  forbidden,
  notFound,
  serverError,
};

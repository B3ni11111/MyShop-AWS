import itemsData from './data/items.json';

const CORS_ORIGIN = 'https://dsoobg7wgy1i3.cloudfront.net';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': CORS_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
};

function getAllItems() {
  return itemsData.flatMap((entry) =>
    entry.category.subCategory.flatMap((sub) => sub.items),
  );
}

function getItemById(id: number) {
  for (const entry of itemsData) {
    for (const subCat of entry.category.subCategory) {
      const item = subCat.items.find((i) => i.id === id);
      if (item) {
        return {
          ...item,
          brandBanner: subCat.brandBanner,
          categoryName: entry.category.categoryName,
          categoryPath: entry.category.path,
        };
      }
    }
  }
  return null;
}

function respond(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

export const handler = async (event: any) => {
  const method =
    event.httpMethod || event.requestContext?.http?.method || 'GET';
  const path = event.path || event.rawPath || '';

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (path === '/api/items' || path === '/api/items/') {
    return respond(200, getAllItems());
  }

  if (path === '/api/items/full') {
    return respond(200, itemsData);
  }

  const match = path.match(/^\/api\/items\/(\d+)$/);
  if (match) {
    const id = parseInt(match[1], 10);
    const item = getItemById(id);
    if (!item) {
      return respond(404, {
        message: `Item with id ${id} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    }
    return respond(200, item);
  }

  return respond(404, { message: 'Not found', error: 'Not Found', statusCode: 404 });
};

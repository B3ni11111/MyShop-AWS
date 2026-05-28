import { handler } from './lambda';

const get = (path: string) => handler({ httpMethod: 'GET', path });

describe('Lambda handler', () => {
  describe('GET /api/items', () => {
    it('returns 200 with all 13 items', async () => {
      const res = await get('/api/items');
      expect(res.statusCode).toBe(200);
      const items = JSON.parse(res.body);
      expect(items).toHaveLength(13);
    });

    it('every item has id, product, price, img, info', async () => {
      const res = await get('/api/items');
      const items = JSON.parse(res.body);
      for (const item of items) {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('product');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('img');
        expect(item).toHaveProperty('info');
      }
    });
  });

  describe('GET /api/items/full', () => {
    it('returns 200 with all 3 categories', async () => {
      const res = await get('/api/items/full');
      expect(res.statusCode).toBe(200);
      const categories = JSON.parse(res.body);
      expect(categories).toHaveLength(3);
    });

    it('categories have the correct names', async () => {
      const res = await get('/api/items/full');
      const categories = JSON.parse(res.body);
      const names = categories.map((c: any) => c.category.categoryName);
      expect(names).toEqual(['Mobile', 'Laptops', 'Sound']);
    });
  });

  describe('GET /api/items/:id', () => {
    it('returns item 1 with brandBanner and categoryName', async () => {
      const res = await get('/api/items/1');
      expect(res.statusCode).toBe(200);
      const item = JSON.parse(res.body);
      expect(item.id).toBe(1);
      expect(item.brandBanner).toBeDefined();
      expect(item.categoryName).toBe('Mobile');
      expect(item.categoryPath).toBe('mobile');
    });

    it('returns item 13 (last item)', async () => {
      const res = await get('/api/items/13');
      expect(res.statusCode).toBe(200);
      const item = JSON.parse(res.body);
      expect(item.id).toBe(13);
    });

    it('returns 404 for unknown id', async () => {
      const res = await get('/api/items/999');
      expect(res.statusCode).toBe(404);
      const body = JSON.parse(res.body);
      expect(body.message).toContain('999');
    });
  });

  describe('CORS and preflight', () => {
    it('OPTIONS returns 200', async () => {
      const res = await handler({ httpMethod: 'OPTIONS', path: '/api/items' });
      expect(res.statusCode).toBe(200);
    });

    it('all responses include CORS header', async () => {
      const res = await get('/api/items');
      expect(res.headers['Access-Control-Allow-Origin']).toBe(
        'https://dsoobg7wgy1i3.cloudfront.net',
      );
    });
  });

  describe('API Gateway v2 event format', () => {
    it('handles rawPath and requestContext.http.method', async () => {
      const res = await handler({
        requestContext: { http: { method: 'GET' } },
        rawPath: '/api/items',
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toHaveLength(13);
    });
  });

  describe('unknown route', () => {
    it('returns 404 for unrecognized path', async () => {
      const res = await get('/not-a-route');
      expect(res.statusCode).toBe(404);
    });
  });
});

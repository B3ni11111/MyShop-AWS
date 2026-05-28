# MyShop — Items API → Lambda Migration Spec

> Analysis only. No source code was changed. This document specifies what the
> Lambda functions and `mockdata.ts` must implement to replace the NestJS/MongoDB
> backend without breaking the frontend.

## 1. Backend service: `server/src/items/items.service.ts`

The service depends on one MongoDB collection: **`itemData`** (set in
`category.schema.ts:64`). Every document has this exact shape:

```ts
{
  category: {
    id: number,
    categoryName: string,
    categoryImg: string,
    path: string,
    subCategory: [
      {
        name: string,          // NOTE: field is "name", not "subCategoryName"
        img: string,
        brandBanner: string,
        path: string,
        items: [
          { id: number, product: string, price: number, img: string, info: string }
        ]
      }
    ]
  }
}
```

### Three methods (all read-only — no writes anywhere in the codebase)

| Method | Logic | Returns |
|---|---|---|
| `findAll()` | `find().lean()` → `categories.flatMap(e => e.category.subCategory.flatMap(s => s.items))` | **Flat array** of `{id, product, price, img, info}` |
| `findAllWithCategories()` | `find().lean()` — raw documents, untouched | **Full nested array** (the shape above) |
| `findOne(id: number)` | Loops every category → subCategory → items, finds `item.id === id` (strict `===`, numeric) | Single item **spread + 3 extra fields**: `{ ...item, brandBanner, categoryName, categoryPath }`. Throws `NotFoundException` if not found |

## 2. HTTP routes: `items.controller.ts` (`@Controller('api/items')`)

| Route | Method | → service | Notes |
|---|---|---|---|
| `GET /api/items` | findAll | flat list | no params |
| `GET /api/items/full` | findAllWithCategories | full tree | **declared before `:id` — must match first** |
| `GET /api/items/:id` | findOne | enriched item | `Number(id)`; if `NaN` → **400 BadRequest**; if not found → **404** |

> **Lambda/API Gateway gotcha:** `/api/items/full` must route to
> `findAllWithCategories`, NOT to `findOne` with `id="full"`. Order the route
> check so the literal `full` path wins before the `{id}` catch-all.

## 3. Frontend consumers (`front/config/api.ts` → 3 endpoints)

`API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"`

| Page | Request | Data shape consumed | Fields actually read |
|---|---|---|---|
| `AllItems.tsx` | `GET /api/items` | `oneItemInterface[]` | `id, product, price, img, info` (sorts by `price` client-side) |
| `Home.tsx` | `GET /api/items/full` | `itemsDataInterface[]` | `category.categoryName, category.categoryImg, category.path`; flattens `subCategory[].items[]` |
| `SubCat.tsx` | `GET /api/items/full` | `itemsDataInterface[]` | filters `category.path === mainCat`; renders `sub.name, sub.img, sub.path` |
| `ShopItems.tsx` | `GET /api/items/full` | `itemsDataInterface[]` | filters `category.path === mainCat` + `sub.path === subCat` (special `"all"`); reads `category.categoryName, sub.name, sub.path`, item fields |
| `ItemPage.tsx` | `GET /api/items/:id` | `ItemWithContext` | `id, product, price, img, info` **+ `brandBanner, categoryName, categoryPath`**; checks `res.ok`, else shows error |

**No API calls:** `Cart.tsx`, `Fav.tsx`, `Checkout.tsx` — localStorage/context only.

## 4. Frontend type contract (`front/types/index.ts`)

```ts
oneItemInterface     = { id: number|string, product, price: number, img, info }
subCategoryInterface = { name, img, brandBanner, path, items: oneItemInterface[] }
itemsDataInterface   = { category: { id: number, categoryName, categoryImg, path, subCategory: subCategoryInterface[] } }
```

## 5. What the next agent must build

**`mockdata.ts`** — one source of truth in the **full nested `itemData` shape**
(array of `{ category: {...} }`). Both other endpoints derive from it:

- `findAll` → flatten `subCategory[].items[]`
- `findOne` → search by numeric `id`, attach `brandBanner` (from parent
  subCategory), `categoryName` + `categoryPath` (from parent category)

**3 Lambda handlers**, JSON responses:

1. `GET /api/items` → flattened item array
2. `GET /api/items/full` → full mockData array verbatim
3. `GET /api/items/{id}` → enriched item; `400` on non-numeric id, `404` when not found

**Critical correctness notes for the next agent:**

- Item `id`s in mock data should be **numbers** (`findOne` uses strict `===`
  against `Number(id)`).
- Subcategory field is **`name`**, not `subCategoryName`.
- Preserve `brandBanner` on subcategories — `ItemPage` renders it and breaks
  silently without it.
- Route precedence: `full` before `{id}`.

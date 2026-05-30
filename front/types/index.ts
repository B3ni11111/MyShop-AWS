// Item types
export interface oneItemInterface {
  id: number | string;
  product: string;
  price: number;
  img: string;
  info: string;
}

// Cart types
export type CartItem = oneItemInterface & {
  quantity: number;
};

// Sub-category types
export interface subCategoryInterface {
  name: string;
  img: string;
  brandBanner: string;
  path: string;
  items: oneItemInterface[];
}

// Items data types
export interface itemsDataInterface {
  category: {
    id: number;
    categoryName: string;
    categoryImg: string;
    path: string;
    subCategory: subCategoryInterface[];
  };
}

// Component props types
export interface BetterItemProps {
  i: oneItemInterface;
  compact?: boolean;
}

// App context types
export type SortOption = "default" | "lowToHigh" | "highToLow" | "recommended";

export interface AppContextType {
  fav: oneItemInterface[];
  cart: CartItem[];
  sort: SortOption;
  itemsData: oneItemInterface[];
  isAuthenticated: boolean;
  resetCart: () => void;
  getTotalItems: () => number;
  addToCart: (item: oneItemInterface) => void;
  toggleFav: (item: oneItemInterface) => void;
  setSort: (sort: SortOption) => void;
  removeFromCart: (itemId: number | string) => void;
  updateQuantity: (id: number | string, newQ: number) => void;
  showAuthMessage: (message: string) => void;
  clearUserData: () => void;
}

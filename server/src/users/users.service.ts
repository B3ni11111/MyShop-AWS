import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CartItem,
  RecentlyViewedItem,
  User,
  UserDocument,
} from './schemas/user.schema';

/** How many recently-viewed products to keep per user. */
const RECENTLY_VIEWED_LIMIT = 20;

/**
 * Backs the cart / favorites / recently-viewed routes in UsersController.
 * Every user document is keyed by the Cognito `sub` (`userId`) and is created
 * lazily the first time we touch it, so callers never have to "register" first.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /** Fetch the user doc, creating an empty one on first access. */
  private async getOrCreate(userId: string): Promise<UserDocument> {
    return this.userModel
      .findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId } },
        { new: true, upsert: true },
      )
      .exec();
  }

  // ==================== CART ====================

  async getCart(userId: string): Promise<CartItem[]> {
    const user = await this.getOrCreate(userId);
    return user.cart;
  }

  /**
   * Upsert a cart line. `qty` is treated as the absolute quantity: if the
   * product is already in the cart we overwrite its qty/price, otherwise we
   * append a new line.
   */
  async addToCart(
    userId: string,
    productId: string,
    qty: number,
    price: number,
  ): Promise<CartItem[]> {
    // Try to update an existing line first.
    const existing = await this.userModel
      .findOneAndUpdate(
        { userId, 'cart.productId': productId },
        { $set: { 'cart.$.qty': qty, 'cart.$.price': price } },
        { new: true },
      )
      .exec();
    if (existing) {
      return existing.cart;
    }

    // No existing line (or no user yet) — push a new one, creating the user
    // doc if needed.
    const user = await this.userModel
      .findOneAndUpdate(
        { userId },
        { $push: { cart: { productId, qty, price } }, $setOnInsert: { userId } },
        { new: true, upsert: true },
      )
      .exec();
    return user.cart;
  }

  async removeFromCart(userId: string, productId: string): Promise<CartItem[]> {
    const user = await this.userModel
      .findOneAndUpdate(
        { userId },
        { $pull: { cart: { productId } }, $setOnInsert: { userId } },
        { new: true, upsert: true },
      )
      .exec();
    return user.cart;
  }

  // ==================== FAVORITES ====================

  async getFavorites(userId: string): Promise<string[]> {
    const user = await this.getOrCreate(userId);
    return user.favorites;
  }

  async addFavorite(userId: string, productId: string): Promise<string[]> {
    // $addToSet keeps the list duplicate-free.
    const user = await this.userModel
      .findOneAndUpdate(
        { userId },
        { $addToSet: { favorites: productId }, $setOnInsert: { userId } },
        { new: true, upsert: true },
      )
      .exec();
    return user.favorites;
  }

  async removeFavorite(userId: string, productId: string): Promise<string[]> {
    const user = await this.userModel
      .findOneAndUpdate(
        { userId },
        { $pull: { favorites: productId }, $setOnInsert: { userId } },
        { new: true, upsert: true },
      )
      .exec();
    return user.favorites;
  }

  // ==================== RECENTLY VIEWED ====================

  async getRecentlyViewed(userId: string): Promise<RecentlyViewedItem[]> {
    const user = await this.getOrCreate(userId);
    return user.recentlyViewed;
  }

  /**
   * Record a product view: drop any prior entry for the same product, prepend
   * a fresh one, and cap the list at RECENTLY_VIEWED_LIMIT (newest first).
   * Done as two writes because Mongo can't $pull and $push the same array in
   * one update.
   */
  async addRecentlyViewed(
    userId: string,
    productId: string,
  ): Promise<RecentlyViewedItem[]> {
    await this.userModel
      .updateOne({ userId }, { $pull: { recentlyViewed: { productId } } })
      .exec();

    const user = await this.userModel
      .findOneAndUpdate(
        { userId },
        {
          $push: {
            recentlyViewed: {
              $each: [{ productId, viewedAt: new Date().toISOString() }],
              $position: 0,
              $slice: RECENTLY_VIEWED_LIMIT,
            },
          },
          $setOnInsert: { userId },
        },
        { new: true, upsert: true },
      )
      .exec();
    return user.recentlyViewed;
  }
}

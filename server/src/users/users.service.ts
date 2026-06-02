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
 * Documents are keyed by the Cognito `sub` (`cognitoSub`) and created lazily on
 * first access. `email` is set on insert because the collection's JSON-schema
 * validator requires both `cognitoSub` and `email`. `cognitoSub` itself is
 * populated from the query filter on upsert (putting it in $setOnInsert too
 * would conflict).
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /** Fetch the user doc, creating an empty one (with email) on first access. */
  private async getOrCreate(
    cognitoSub: string,
    email: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        { cognitoSub },
        { $setOnInsert: { email } },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return user!;
  }

  // ==================== CART ====================

  async getCart(cognitoSub: string, email: string): Promise<CartItem[]> {
    const user = await this.getOrCreate(cognitoSub, email);
    return user.cart;
  }

  /**
   * Upsert a cart line. `qty` is the absolute quantity: overwrite it if the
   * product is already in the cart, otherwise append a new line.
   */
  async addToCart(
    cognitoSub: string,
    email: string,
    productId: string,
    qty: number,
    price: number,
  ): Promise<CartItem[]> {
    const existing = await this.userModel
      .findOneAndUpdate(
        { cognitoSub, 'cart.productId': productId },
        { $set: { 'cart.$.qty': qty, 'cart.$.price': price } },
        { returnDocument: 'after' },
      )
      .exec();
    if (existing) {
      return existing.cart;
    }

    const user = await this.userModel
      .findOneAndUpdate(
        { cognitoSub },
        { $push: { cart: { productId, qty, price } }, $setOnInsert: { email } },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return user!.cart;
  }

  async removeFromCart(
    cognitoSub: string,
    email: string,
    productId: string,
  ): Promise<CartItem[]> {
    const user = await this.userModel
      .findOneAndUpdate(
        { cognitoSub },
        { $pull: { cart: { productId } }, $setOnInsert: { email } },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return user!.cart;
  }

  // ==================== FAVORITES ====================

  async getFavorites(cognitoSub: string, email: string): Promise<string[]> {
    const user = await this.getOrCreate(cognitoSub, email);
    return user.favorites;
  }

  async addFavorite(
    cognitoSub: string,
    email: string,
    productId: string,
  ): Promise<string[]> {
    const user = await this.userModel
      .findOneAndUpdate(
        { cognitoSub },
        { $addToSet: { favorites: productId }, $setOnInsert: { email } },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return user!.favorites;
  }

  async removeFavorite(
    cognitoSub: string,
    email: string,
    productId: string,
  ): Promise<string[]> {
    const user = await this.userModel
      .findOneAndUpdate(
        { cognitoSub },
        { $pull: { favorites: productId }, $setOnInsert: { email } },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return user!.favorites;
  }

  // ==================== RECENTLY VIEWED ====================

  async getRecentlyViewed(
    cognitoSub: string,
    email: string,
  ): Promise<RecentlyViewedItem[]> {
    const user = await this.getOrCreate(cognitoSub, email);
    return user.recentlyViewed;
  }

  /**
   * Record a product view: drop any prior entry for the same product, prepend a
   * fresh one, and cap the list at RECENTLY_VIEWED_LIMIT (newest first). Two
   * writes because Mongo can't $pull and $push the same array in one update.
   */
  async addRecentlyViewed(
    cognitoSub: string,
    email: string,
    productId: string,
  ): Promise<RecentlyViewedItem[]> {
    await this.userModel
      .updateOne({ cognitoSub }, { $pull: { recentlyViewed: { productId } } })
      .exec();

    const user = await this.userModel
      .findOneAndUpdate(
        { cognitoSub },
        {
          $push: {
            recentlyViewed: {
              $each: [{ productId, viewedAt: new Date().toISOString() }],
              $position: 0,
              $slice: RECENTLY_VIEWED_LIMIT,
            },
          },
          $setOnInsert: { email },
        },
        { returnDocument: 'after', upsert: true },
      )
      .exec();
    return user!.recentlyViewed;
  }
}

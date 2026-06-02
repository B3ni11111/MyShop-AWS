import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * One line item in a user's cart. `qty` is the *absolute* quantity for that
 * product — the frontend computes the new total and sends it, so the server
 * stores it as-is rather than incrementing.
 */
@Schema({ _id: false })
export class CartItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true, min: 1 })
  qty: number;

  @Prop({ required: true, min: 0 })
  price: number;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

/** A product the user opened, newest first. `viewedAt` is an ISO timestamp. */
@Schema({ _id: false })
export class RecentlyViewedItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  viewedAt: string;
}
export const RecentlyViewedItemSchema =
  SchemaFactory.createForClass(RecentlyViewedItem);

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  /** Cognito `sub` — the canonical user id used in every `/users/:userId` route. */
  @Prop({ required: true, unique: true, index: true })
  userId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  cart: CartItem[];

  /** Favorited product ids. Stored as a unique set of strings. */
  @Prop({ type: [String], default: [] })
  favorites: string[];

  @Prop({ type: [RecentlyViewedItemSchema], default: [] })
  recentlyViewed: RecentlyViewedItem[];
}

export const UserSchema = SchemaFactory.createForClass(User);

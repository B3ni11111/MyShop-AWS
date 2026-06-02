import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CognitoAuthGuard } from './auth/cognito-auth.guard';
import { AuthEmail } from './auth/auth-user.decorator';
import { UsersService } from './users.service';

interface AddToCartDto {
  productId?: string;
  qty?: number;
  price?: number;
}

interface ProductIdDto {
  productId?: string;
}

@Controller('users/:userId')
@UseGuards(CognitoAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== CART ====================

  @Get('cart')
  async getCart(@Param('userId') userId: string, @AuthEmail() email: string) {
    const cart = await this.usersService.getCart(userId, email);
    return { cart };
  }

  @Post('cart')
  async addToCart(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
    @Body() body: AddToCartDto,
  ) {
    const { productId, qty, price } = body;

    if (!productId || qty === undefined || price === undefined) {
      throw new BadRequestException(
        'Missing required fields: productId, qty, price',
      );
    }
    if (typeof qty !== 'number' || qty < 1) {
      throw new BadRequestException('qty must be a positive number');
    }
    if (typeof price !== 'number' || price < 0) {
      throw new BadRequestException('price must be a non-negative number');
    }

    const cart = await this.usersService.addToCart(
      userId,
      email,
      productId,
      qty,
      price,
    );
    return { cart };
  }

  @Delete('cart/:productId')
  async removeFromCart(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
    @Param('productId') productId: string,
  ) {
    const cart = await this.usersService.removeFromCart(
      userId,
      email,
      productId,
    );
    return { cart };
  }

  // ==================== FAVORITES ====================

  @Get('favorites')
  async getFavorites(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
  ) {
    const favorites = await this.usersService.getFavorites(userId, email);
    return { favorites };
  }

  @Post('favorites')
  async addFavorite(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
    @Body() body: ProductIdDto,
  ) {
    if (!body.productId) {
      throw new BadRequestException('Missing required field: productId');
    }
    const favorites = await this.usersService.addFavorite(
      userId,
      email,
      body.productId,
    );
    return { favorites };
  }

  @Delete('favorites/:productId')
  async removeFavorite(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
    @Param('productId') productId: string,
  ) {
    const favorites = await this.usersService.removeFavorite(
      userId,
      email,
      productId,
    );
    return { favorites };
  }

  // ==================== RECENTLY VIEWED ====================

  @Get('recently-viewed')
  async getRecentlyViewed(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
  ) {
    const recentlyViewed = await this.usersService.getRecentlyViewed(
      userId,
      email,
    );
    return { recentlyViewed };
  }

  @Post('recently-viewed')
  async addRecentlyViewed(
    @Param('userId') userId: string,
    @AuthEmail() email: string,
    @Body() body: ProductIdDto,
  ) {
    if (!body.productId) {
      throw new BadRequestException('Missing required field: productId');
    }
    const recentlyViewed = await this.usersService.addRecentlyViewed(
      userId,
      email,
      body.productId,
    );
    return { recentlyViewed };
  }
}

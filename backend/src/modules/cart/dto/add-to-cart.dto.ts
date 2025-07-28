import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ProductSize } from '@core/domain/entities/product.entity';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsEnum(ProductSize)
  size?: ProductSize;

  @IsOptional()
  @IsString()
  color?: string;
}
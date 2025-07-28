import { IsNumber, IsOptional, IsEnum, IsString, Min } from 'class-validator';
import { ProductSize } from '@core/domain/entities/product.entity';

export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsEnum(ProductSize)
  size?: ProductSize;

  @IsOptional()
  @IsString()
  color?: string;
}
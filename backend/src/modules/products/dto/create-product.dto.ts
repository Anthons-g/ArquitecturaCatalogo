import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
  IsNotEmpty,
} from 'class-validator';
import {
  ProductCategory,
  ProductGender,
  ProductSize,
} from '@core/domain/entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsEnum(ProductGender)
  gender: ProductGender;

  @IsArray()
  @IsEnum(ProductSize, { each: true })
  availableSizes: ProductSize[];

  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  material?: string;
}
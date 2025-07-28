import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsNotEmpty } from 'class-validator';
import { UserRole } from '@core/domain/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
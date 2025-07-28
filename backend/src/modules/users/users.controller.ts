import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '@shared/decorators/roles.decorator';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { UserRole } from '@core/domain/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: UserRole
  ) {
    return this.usersService.findAll(page, limit, role);
  }

  @Get('search')
  @Roles(UserRole.ADMIN)
  searchUsers(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.usersService.searchUsers(query, page, limit);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

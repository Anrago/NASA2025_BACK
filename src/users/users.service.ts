import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { RemoveFavoriteDto } from './dto/remove-favorite.dto';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        this.saltRounds,
      );

      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return await user.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async addToFavorites(
    userId: string,
    addFavoriteDto: AddFavoriteDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.favorites.includes(addFavoriteDto.articleId)) {
      throw new BadRequestException('Article is already in favorites');
    }

    user.favorites.push(addFavoriteDto.articleId);
    return user.save();
  }

  async removeFromFavorites(
    userId: string,
    removeFavoriteDto: RemoveFavoriteDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const favoriteIndex = user.favorites.indexOf(removeFavoriteDto.articleId);
    if (favoriteIndex === -1) {
      throw new BadRequestException('Article is not in favorites');
    }

    user.favorites.splice(favoriteIndex, 1);
    return user.save();
  }

  async getFavorites(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.favorites;
  }
}

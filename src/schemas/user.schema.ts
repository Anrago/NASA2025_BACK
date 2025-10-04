import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  toObject() {
    throw new Error('Method not implemented.');
  }
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@nasa.gov',
  })
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    nullable: true,
  })
  @Prop({ default: null })
  image: string;

  @ApiProperty({
    description: 'Array of favorite article IDs',
    example: ['article1', 'article2'],
    nullable: true,
  })
  @Prop({ default: [], type: [String] })
  favorites: string[];

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2025-10-04T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2025-10-04T12:00:00.000Z',
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

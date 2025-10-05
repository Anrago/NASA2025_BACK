import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { articles } from './articles.schema';

export type MessageDocument = HydratedDocument<Message>;

export enum MessageRole {
  USER = 'User',
  SYSTEM = 'System',
}

@Schema({ timestamps: true })
export class Message {
  @ApiProperty({
    description: 'The unique identifier of the message',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The ID of the chat history this message belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Historical',
    required: true,
    index: true,
  })
  historical_user_id: Types.ObjectId;

  @ApiProperty({
    description: 'The role of the message sender',
    enum: MessageRole,
    example: MessageRole.USER,
  })
  @Prop({ required: true, enum: Object.values(MessageRole) })
  rol: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'What are the latest findings from the Mars rover?',
  })
  @Prop({ required: true, trim: true })
  message: string;

  @ApiProperty({
    description: 'Timestamp when the message was created',
    example: '2025-10-04T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the message was last updated',
    example: '2025-10-04T12:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Articles associated with the message',
    type: [articles],
  })
  @Prop({ type: [Object], default: [] })
  articles: articles[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

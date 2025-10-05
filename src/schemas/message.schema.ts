import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Related articles from AI response (only for System messages)',
    type: [Object],
    required: false,
  })
  @Prop({ type: [Object], default: [] })
  related_articles?: any[];

  @ApiProperty({
    description:
      'Relationship graph from AI response (only for System messages)',
    type: Object,
    required: false,
  })
  @Prop({ type: Object, default: null })
  relationship_graph?: any;

  @ApiProperty({
    description:
      'Research gaps from AI response (only for System messages with RAG)',
    type: [Object],
    required: false,
  })
  @Prop({ type: [Object], default: [] })
  research_gaps?: any[];

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
}

export const MessageSchema = SchemaFactory.createForClass(Message);

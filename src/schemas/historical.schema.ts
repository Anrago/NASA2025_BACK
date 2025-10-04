import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type HistoricalDocument = HydratedDocument<Historical>;

@Schema({ timestamps: true })
export class Historical {
  @ApiProperty({
    description: 'The unique identifier of the chat history',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The ID of the user who owns this chat history',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user_id: Types.ObjectId;

  @ApiProperty({
    description: 'The title or name of the chat conversation',
    example: 'NASA Research Discussion',
    nullable: true,
  })
  @Prop({ trim: true, default: null })
  title: string;

  @ApiProperty({
    description: 'Timestamp when the chat was created',
    example: '2025-10-04T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the chat was last updated',
    example: '2025-10-04T12:30:00.000Z',
  })
  updatedAt: Date;
}

export const HistoricalSchema = SchemaFactory.createForClass(Historical);

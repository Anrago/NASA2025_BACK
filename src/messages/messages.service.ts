import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  /**
   * Creates a new message in a chat history
   * @param createMessageDto - The data to create a new message
   * @returns The created message
   */
  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    return await message.save();
  }

  /**
   * Retrieves all messages
   * @returns Array of all messages
   */
  async findAll(): Promise<Message[]> {
    return this.messageModel
      .find()
      .populate('historical_user_id')
      .sort({ createdAt: 1 })
      .exec();
  }

  /**
   * Retrieves all messages for a specific chat history
   * @param historicalId - The ID of the chat history
   * @returns Array of messages in chronological order
   */
  async findByHistoricalId(historicalId: string): Promise<Message[]> {
    return this.messageModel
      .find({ historical_user_id: historicalId })
      .sort({ createdAt: 1 })
      .exec();
  }

  /**
   * Retrieves a single message by its ID
   * @param id - The ID of the message
   * @returns The message if found
   * @throws NotFoundException if the message doesn't exist
   */
  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel
      .findById(id)
      .populate('historical_user_id')
      .exec();
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  /**
   * Updates a message
   * @param id - The ID of the message to update
   * @param updateMessageDto - The data to update
   * @returns The updated message
   * @throws NotFoundException if the message doesn't exist
   */
  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, { new: true })
      .exec();
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  /**
   * Deletes a message
   * @param id - The ID of the message to delete
   * @returns The deleted message
   * @throws NotFoundException if the message doesn't exist
   */
  async remove(id: string): Promise<Message> {
    const message = await this.messageModel.findByIdAndDelete(id).exec();
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  /**
   * Deletes all messages for a specific chat history
   * @param historicalId - The ID of the chat history
   * @returns The result of the deletion operation
   */
  async removeByHistoricalId(historicalId: string): Promise<any> {
    return this.messageModel
      .deleteMany({ historical_user_id: historicalId })
      .exec();
  }
}

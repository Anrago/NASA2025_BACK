import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historical, HistoricalDocument } from '../schemas/historical.schema';
import { CreateHistoricalDto } from './dto/create-historical.dto';
import { UpdateHistoricalDto } from './dto/update-historical.dto';

@Injectable()
export class HistoricalService {
  constructor(
    @InjectModel(Historical.name)
    private historicalModel: Model<HistoricalDocument>,
  ) {}

  /**
   * Creates a new chat history for a user
   * @param createHistoricalDto - The data to create a new chat history
   * @returns The created chat history
   */
  async create(createHistoricalDto: CreateHistoricalDto): Promise<Historical> {
    const historical = new this.historicalModel(createHistoricalDto);
    return await historical.save();
  }

  /**
   * Retrieves all chat histories
   * @returns Array of all chat histories
   */
  async findAll(): Promise<Historical[]> {
    return this.historicalModel.find().populate('user_id', 'name email').exec();
  }

  /**
   * Retrieves all chat histories for a specific user
   * @param userId - The ID of the user
   * @returns Array of chat histories belonging to the user
   */
  async findByUserId(userId: string): Promise<Historical[]> {
    return this.historicalModel
      .find({ user_id: userId })
      .sort({ updatedAt: -1 })
      .exec();
  }

  /**
   * Retrieves a single chat history by its ID
   * @param id - The ID of the chat history
   * @returns The chat history if found
   * @throws NotFoundException if the chat history doesn't exist
   */
  async findOne(id: string): Promise<Historical> {
    const historical = await this.historicalModel
      .findById(id)
      .populate('user_id', 'name email')
      .exec();
    if (!historical) {
      throw new NotFoundException(`Historical with ID ${id} not found`);
    }
    return historical;
  }

  /**
   * Updates a chat history
   * @param id - The ID of the chat history to update
   * @param updateHistoricalDto - The data to update
   * @returns The updated chat history
   * @throws NotFoundException if the chat history doesn't exist
   */
  async update(
    id: string,
    updateHistoricalDto: UpdateHistoricalDto,
  ): Promise<Historical> {
    const historical = await this.historicalModel
      .findByIdAndUpdate(id, updateHistoricalDto, { new: true })
      .exec();
    if (!historical) {
      throw new NotFoundException(`Historical with ID ${id} not found`);
    }
    return historical;
  }

  /**
   * Deletes a chat history
   * @param id - The ID of the chat history to delete
   * @returns The deleted chat history
   * @throws NotFoundException if the chat history doesn't exist
   */
  async remove(id: string): Promise<Historical> {
    const historical = await this.historicalModel.findByIdAndDelete(id).exec();
    if (!historical) {
      throw new NotFoundException(`Historical with ID ${id} not found`);
    }
    return historical;
  }

  /**
   * Deletes all chat histories for a specific user
   * @param userId - The ID of the user
   * @returns The result of the deletion operation
   */
  async removeByUserId(userId: string): Promise<any> {
    return this.historicalModel.deleteMany({ user_id: userId }).exec();
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { HistoricalService } from './historical.service';
import { CreateHistoricalDto } from './dto/create-historical.dto';
import { UpdateHistoricalDto } from './dto/update-historical.dto';
import { Historical } from '../schemas/historical.schema';

@ApiTags('historical')
@Controller('historical')
export class HistoricalController {
  constructor(private readonly historicalService: HistoricalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new chat history',
    description:
      'Creates a new chat history for a user to store conversation messages.',
  })
  @ApiBody({
    type: CreateHistoricalDto,
    description: 'Chat history creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Chat history successfully created',
    type: Historical,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() createHistoricalDto: CreateHistoricalDto) {
    return this.historicalService.create(createHistoricalDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all chat histories',
    description: 'Retrieves all chat histories from all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all chat histories',
    type: [Historical],
  })
  findAll() {
    return this.historicalService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get all chat histories for a specific user',
    description:
      'Retrieves all chat histories belonging to a specific user, sorted by last update',
  })
  @ApiParam({
    name: 'userId',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user chat histories',
    type: [Historical],
  })
  findByUserId(@Param('userId') userId: string) {
    return this.historicalService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a chat history by ID',
    description: 'Retrieves a specific chat history with user details',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the chat history',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat history found',
    type: Historical,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat history not found',
  })
  findOne(@Param('id') id: string) {
    return this.historicalService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a chat history',
    description:
      'Updates the information of a specific chat history (e.g., title)',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the chat history',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateHistoricalDto,
    description: 'Chat history update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat history successfully updated',
    type: Historical,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat history not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateHistoricalDto: UpdateHistoricalDto,
  ) {
    return this.historicalService.update(id, updateHistoricalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a chat history',
    description:
      'Deletes a specific chat history. Note: This does not automatically delete associated messages.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the chat history',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat history successfully deleted',
    type: Historical,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat history not found',
  })
  remove(@Param('id') id: string) {
    return this.historicalService.remove(id);
  }

  @Delete('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete all chat histories for a user',
    description: 'Deletes all chat histories belonging to a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'MongoDB ObjectId of the user',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'All user chat histories successfully deleted',
  })
  removeByUserId(@Param('userId') userId: string) {
    return this.historicalService.removeByUserId(userId);
  }
}

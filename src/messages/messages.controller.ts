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
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from '../schemas/message.schema';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new message',
    description:
      'Creates a new message in a chat history. Messages can be from User or System roles.',
  })
  @ApiBody({
    type: CreateMessageDto,
    description: 'Message creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Message successfully created',
    type: Message,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all messages',
    description: 'Retrieves all messages from all chat histories',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all messages',
    type: [Message],
  })
  findAll() {
    return this.messagesService.findAll();
  }

  @Get('historical/:historicalId')
  @ApiOperation({
    summary: 'Get all messages for a specific chat history',
    description:
      'Retrieves all messages belonging to a specific chat history in chronological order',
  })
  @ApiParam({
    name: 'historicalId',
    description: 'MongoDB ObjectId of the chat history',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages in the chat history',
    type: [Message],
  })
  findByHistoricalId(@Param('historicalId') historicalId: string) {
    return this.messagesService.findByHistoricalId(historicalId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a message by ID',
    description: 'Retrieves a specific message with chat history details',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the message',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Message found',
    type: Message,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a message',
    description: 'Updates the content or role of a specific message',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the message',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateMessageDto,
    description: 'Message update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Message successfully updated',
    type: Message,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a message',
    description: 'Deletes a specific message from a chat history',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the message',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Message successfully deleted',
    type: Message,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Delete('historical/:historicalId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete all messages for a chat history',
    description: 'Deletes all messages belonging to a specific chat history',
  })
  @ApiParam({
    name: 'historicalId',
    description: 'MongoDB ObjectId of the chat history',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'All messages in the chat history successfully deleted',
  })
  removeByHistoricalId(@Param('historicalId') historicalId: string) {
    return this.messagesService.removeByHistoricalId(historicalId);
  }
}

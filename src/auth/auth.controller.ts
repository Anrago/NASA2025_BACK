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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Authenticate a user and generate a JWT',
    description:
      'Authenticates a user and generates a JWT. The user must provide valid credentials.',
  })
  @ApiBody({
    type: Auth,
    description: 'User authentication data',
  })
  async login(@Body() credentials: Auth) {
    if (!credentials.email || !credentials.password) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }

    return await this.authService.login(credentials);
  }
}

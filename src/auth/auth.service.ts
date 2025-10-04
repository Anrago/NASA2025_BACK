import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

interface Auth {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    if (!email || !pass) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }

    console.log('Buscando usuario con email:', email);
    const user = await this.usersService.findByEmail(email);
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');

    if (!user) {
      throw new UnauthorizedException('Email inválido');
    }

    console.log('Validando contraseña...');
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    console.log('Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    // Convert Mongoose document to plain object
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...result } = userObj as { password: string; [key: string]: any };
    console.log('Usuario validado:', result);
    return result;
  }

  async login(payload: Auth) {
    console.log('Iniciando login para:', payload.email);
    const user = await this.validateUser(payload.email, payload.password);
    console.log('Usuario después de validación:', user);

    const jwtPayload = { email: user.email, sub: user._id || user.id };

    const response = {
      access_token: this.jwtService.sign(jwtPayload),
      user: {
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    };

    console.log('Respuesta del login:', response);
    return response;
  }
}

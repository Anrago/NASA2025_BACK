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

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email inválido');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    // Convert Mongoose document to plain object
    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...result } = userObj as {
      password: string;
      [key: string]: any;
    };
    return result;
  }

  async login(payload: Auth) {
    const user = await this.validateUser(payload.email, payload.password);
    const jwtPayload = { email: user.email, sub: user._id || user.id };

    const response = {
      access_token: this.jwtService.sign(jwtPayload),
      user: {
        _id: user._id || user.id, // Usar _id consistentemente
        id: user._id || user.id, // Mantener id para compatibilidad
        email: user.email,
        name: user.name,
        image: user.image,
      },
    };

    return response;
  }
}

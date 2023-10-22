import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from '../dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/users.model';
import { ExtractJwt } from 'passport-jwt';
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme;
import { Constants } from 'src/constant/constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userService.findAll();
  }

  async register(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    const token = await this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);
    const token = await this._createToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(email) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async getAccess2FA(user) {
    return this._createToken(user, true);
  }

  private async _createToken(
    { email },
    isSecondFactorAuthenticated = false,
    refresh = true,
  ) {
    const accessToken = this.jwtService.sign({
      email,
      isSecondFactorAuthenticated,
    });
    if (refresh) {
      const refreshToken = this.jwtService.sign(
        { email },
        {
          secret: Constants.secret,
          expiresIn: Constants.expiresin,
        },
      );
      await this.userService.update(
        { email: email },
        {
          refreshToken: refreshToken,
        },
      );
      return {
        expiresIn: Constants.expiresin,
        accessToken,
        refreshToken,
        expiresInRefresh: Constants.expiresin_refresh,
      };
    } else {
      return {
        expiresIn: Constants.expiresin,
        accessToken,
      };
    }
  }

  async refresh(refresh_token) {
    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: Constants.expiresin,
      });
      const user = await this.userService.getUserByRefresh(
        refresh_token,
        payload.email,
      );
      const token = await this._createToken(user, true, false);
      return {
        email: user.email,
        ...token,
      };
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(user: User) {
    await this.userService.update(
      { email: user.email },
      { refreshToken: null },
    );
  }
}
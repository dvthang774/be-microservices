import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/users.repository';
import { CreateUserDto, LoginUserDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async create(userDto: CreateUserDto) {
    userDto.password = await bcrypt.hash(userDto.password, 10);
    return await this.userRepository.create(userDto);
  }

//   async setTwoFactorAuthenticationSecret(secret, user_id) {
//     return this.userRepository.findByIdAndUpdate(user_id, {
//       twoFactorAuthenticationSecret: secret,
//     });
//   }

//   async turnOnTwoFactorAuthentication(user_id: string) {
//     return this.userRepository.findByIdAndUpdate(user_id, {
//       isTwoFactorAuthenticationEnabled: true,
//     });
//   }

async findAll() {
  return await this.userRepository.getByCondition({});
}

  async findByLogin({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findByCondition({
      email: email,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const is_equal = bcrypt.compareSync(password, user.password);

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findByEmail(email) {
    return await this.userRepository.findByCondition({
      email: email,
    });
  }

  async update(filter, update) {
    if (update.refreshToken) {
      update.refreshToken = await bcrypt.hash(
        this.reverse(update.refreshToken),
        10,
      );
    }
    return await this.userRepository.findByConditionAndUpdate(filter, update);
  }

  async getUserByRefresh(refresh_token, email) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      this.reverse(refresh_token),
      user.refreshToken,
    );

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private reverse(s) {
    return s.split('').reverse().join('');
  }
}
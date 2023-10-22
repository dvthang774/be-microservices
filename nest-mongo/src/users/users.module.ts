import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/users.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/repositories/users.repository';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sign } from 'crypto';
import { Constants } from 'src/constant/constant';

@Module({
  imports:[  ConfigModule.forRoot(),
    MongooseModule.forFeature([
    {   name:'User',
        schema:UserSchema
    }
    ]),
    PassportModule.register({
      defaultStrategy:'jwt',
      property:'user',
      session:false
    }),
    JwtModule.register({
      secret: Constants.secret,
      signOptions: { expiresIn: Constants.expiresin },
}),
  ],
  controllers: [UserController, AuthController],
  providers: [UsersService, AuthService, UserRepository, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}

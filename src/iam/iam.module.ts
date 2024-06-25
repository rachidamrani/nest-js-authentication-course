import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccesTokenGuard } from './authentication/guards/acces-token/acces-token.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService, // whenever the hashing service token is resolved, it will point to the bcrypt service,
      /**
       * BcryptService concret implementation of the hashing service, if we ever need to change the implementation of the hashing service,
       * we can do it simply by creating a new service that implements the hashing service
       */
      useClass: BcryptService,
    },
    {
      // provide the access token guard gloabally in the application
      provide: APP_GUARD,
      useClass: AccesTokenGuard,
    },
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}

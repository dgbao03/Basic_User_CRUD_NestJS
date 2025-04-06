import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [AuthModule, JwtModule, TypeOrmModule.forFeature([User])]
})
export class UserModule {}

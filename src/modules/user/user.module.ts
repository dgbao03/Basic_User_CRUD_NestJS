import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [AuthModule, JwtModule]
})
export class UserModule {}

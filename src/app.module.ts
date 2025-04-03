import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [AuthModule, JwtModule, UserModule,
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: path.resolve(__dirname, './configs/.env')
    })
  ],
  providers: [AppService],
})

export class AppModule {}

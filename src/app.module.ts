import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeorm from './databases/typeorm';


@Module({
  imports: [AuthModule, JwtModule, UserModule,
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: path.resolve(__dirname, './configs/.env'),
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm') as TypeOrmModuleOptions)
    })
  ],
  providers: [AppService],
})

export class AppModule {}

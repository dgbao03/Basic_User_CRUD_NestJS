import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from 'src/modules/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException("Invalid Token!");
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, this.configService.get("ACCESS_SECRET_TOKEN"));
      request.user = decoded; 
      
      return true
    } catch (error) {
      return false;
    }
  }
}
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO, UpdateUserDTO, SignInPayloadDTO } from './user.dto';
import { JwtService } from '../jwt/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UserService {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>
    ){}

    async getAllUsers() {
        return await this.userRepository.find();
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) throw new NotFoundException("User not found!");

        return user;
    }

    async signIn(payload: SignInPayloadDTO) {
        const user = await this.userRepository.findOne({ where: { username: payload.username } });
        if (!user) throw new NotFoundException("User not found!");

        const checkPassword = await this.authService.comparePassword(payload.password, user.password);
        if (!checkPassword) throw new BadRequestException("Password is incorrect!");

        return {
            accessToken: this.jwtService.sign(
                {
                    id: user.id,
                    username: user.username
                }, 
                this.configService.get("ACCESS_SECRET_TOKEN"),
                {
                    expiresIn: '15m'
                }
            ), 

            refreshToken: this.jwtService.sign(
                {
                    id: user.id,
                    username: user.username
                }, 
                this.configService.get("REFRESH_SECRET_TOKEN"),
                {
                    expiresIn: '1h'
                }
            )
        }
    }

    async createUser(userData: CreateUserDTO) {
        const user = this.userRepository.create(userData); 
        user.id = uuidv4();
        user.password = this.authService.hashPassword(user.password);
        
        return await this.userRepository.save(user);
    }

    async updateUser(id: string, updateData: UpdateUserDTO, currentUserId: string) {
        if (id != currentUserId) throw new ForbiddenException();
        
        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id: string) {
        return await this.userRepository.delete(id);

    }
}


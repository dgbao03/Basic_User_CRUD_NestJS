import { Injectable, NotFoundException, BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO, UpdateUserDTO, SignInPayloadDTO } from './user.dto';
import { JwtService } from '../jwt/jwt.service';
import { User } from 'src/interfaces/User';
import { AuthGuard } from 'src/guards/auth.guard';


@Injectable()
export class UserService {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ){}

    private _users: User[] = 
    [{
        id: uuidv4(),
        fullname: 'Nguyễn Văn ABC',
        age: 25,
        email: 'nguyenvana@example.com',
        username: 'nguyenvana',
        password: '$2b$10$31JK2iiRYTEjFMp1prfV5OecRe8cDuqKfd1JqR0.83EuvjEgg5wz.',
    },
    {
        id: uuidv4(),
        fullname: 'Lê Văn C',
        age: 28,
        email: 'levanc@example.com',
        username: 'levanc',
        password: '$2b$10$31JK2iiRYTEjFMp1prfV5OecRe8cDuqKfd1JqR0.83EuvjEgg5wz.',
    },
    {
        id: uuidv4(),
        fullname: 'Đỗ Gia B',
        age: 21,
        email: 'baodo@example.com',
        username: 'baodo',
        password: '$2b$10$31JK2iiRYTEjFMp1prfV5OecRe8cDuqKfd1JqR0.83EuvjEgg5wz.',
    }];

    @UseGuards(AuthGuard)
    getAllUsers() {
        return this._users;
    }

    @UseGuards(AuthGuard)
    getUserById(id: string) {
        const user = this._users.find(user => user.id === id);
        if(!user) throw new NotFoundException("User not found!");

        return user;
    }

    async signIn(payload: SignInPayloadDTO) {
        const user = this._users.find(user => user.username === payload.username);
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

    @UseGuards(AuthGuard)
    createUser(userData: CreateUserDTO) {
        userData.password = this.authService.hashPassword(userData.password);

        return this._users.push({ id: uuidv4(), ...userData });
    }

    @UseGuards(AuthGuard)
    updateUser(id: string, updateData: UpdateUserDTO, currentUserId: string) {
        if (id != currentUserId) throw new ForbiddenException();

        let updateUser = this.getUserById(id);
    
        if (!updateUser) {
          throw new BadRequestException("User not found!");  
        }

        updateUser = { ...updateUser, ...updateData };
    
        const index = this._users.findIndex(user => user.id === id);
        if (index != -1) {
            this._users[index] = updateUser;
        }
    
        return updateUser; 
    }

    @UseGuards(AuthGuard)
    deleteUser(id: string) {
        const deletedIndex = this._users.findIndex(user => user.id === id);
        if (deletedIndex === -1) throw new NotFoundException();

        return this._users.splice(deletedIndex, 1);
    }
}


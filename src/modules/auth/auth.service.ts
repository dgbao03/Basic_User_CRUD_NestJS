import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    hashPassword(plainPassword: string) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainPassword, salt);
    }

    async comparePassword(plainPassword: string, hashedPassword: string) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

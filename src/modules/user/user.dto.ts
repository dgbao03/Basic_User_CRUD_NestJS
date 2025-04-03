import { IsEmail, IsNotEmpty, IsNumber, IsOptional, } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateUserDTO {
    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value)) 
    age: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class UpdateUserDTO {
    @IsOptional()
    fullname: string;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value)) 
    age: number;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    username: string;
}

export class SignInPayloadDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string
}
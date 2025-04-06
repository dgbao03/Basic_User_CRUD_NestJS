import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ name: "users"})
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    fullname: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;
}
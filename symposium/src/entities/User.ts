import {
    Entity,
    ManyToMany,
    OneToMany,
    JoinTable,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
} from "typeorm";

import { Paper } from "./Paper";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    affiliation!: string;

    @Column("text", { array: true })
    roles!: string[];

    @OneToMany(() => Paper, (paper) => paper.creator)
    papers: Paper[];

    @ManyToMany(() => Paper)
    @JoinTable()
    sharedWithMe: Paper[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

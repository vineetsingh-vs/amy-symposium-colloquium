import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
    JoinTable, OneToOne, OneToMany, ManyToOne,
} from "typeorm";
import { User } from "./User";
import {Paper} from "./Paper";

@Entity()
export class PaperReviewAuth extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    redirect_url: string;

    @UpdateDateColumn()
    time_to_live: Date;

    @Column()
    visited: boolean;
}

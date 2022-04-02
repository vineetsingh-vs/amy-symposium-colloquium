import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Paper } from "./Paper";

@Entity()
export class Extra extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    value!: string;

    @ManyToOne(() => Paper, (paper: Paper) => paper.extras, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    paper: Paper;
}
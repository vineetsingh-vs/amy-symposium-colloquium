import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Paper } from './Paper';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn("uuid")
    tag_id: string;

    @Column("text")
    paper_id: string

    @Column("text")
    name: string;


}
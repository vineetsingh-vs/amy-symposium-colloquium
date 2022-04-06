import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Paper } from "./Paper";
import { Comment } from "./Comment";

@Entity()
export class Version {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    filepath: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Paper, (paper) => paper.versions)
    paper: Paper;

    @OneToMany(() => Comment, (comment) => comment.version)
    comments: Comment[];
}

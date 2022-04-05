import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Paper } from "./Paper";
import { Comment } from "./Comment";

@Entity()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Paper, (paper_id) => paper_id.reviews)
    paper_id!: number;

    @Column()
    paper_version!: number;

    @Column()
    content!: string;

    @Column()
    user!: number;

    @OneToMany(() => Comment, (comment) => comment.paper_id)
    comments: Comment[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
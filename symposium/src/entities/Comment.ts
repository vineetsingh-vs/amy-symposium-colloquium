import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Column,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { Version } from "./Version";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    paper_id!: number;

    @ManyToOne(() => Version, (version) => version.comments)
    version: Version;

    @ManyToOne(() => Comment, (comment) => comment.replies)
    parent: Comment;

    @OneToMany(() => Comment, (comment) => comment.parent)
    replies: Comment[];

    @Column()
    pageNum: number;

    @Column()
    content!: string;

    @Column()
    user!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Column,
    BaseEntity,
    ManyToOne,
    JoinTable,
    Tree,
    TreeChildren,
    TreeParent,
} from "typeorm";
import { Version } from "./Version";

@Entity()
@Tree("adjacency-list")
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Version, (version) => version.comments)
    version!: Version;

    @ManyToOne(() => Comment, (comment) => comment.replies)
    parent: Comment;

    @OneToMany(() => Comment, (comment) => comment.parent)
    replies: Comment[];

    @Column()
    pageNum: number;

    @Column()
    content!: string;

    @Column({nullable: true})
    user!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

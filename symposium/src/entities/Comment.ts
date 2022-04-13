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

    @ManyToOne(() => Version, (version) => version.comments, {
        eager: true
    })
    version!: Version;

    @ManyToOne(() => Comment, (comment) => comment.replies, {
        onUpdate: 'CASCADE'
    })
    parent: Comment;

    @OneToMany(() => Comment, (comment) => comment.parent, {
        cascade: true
    })
    replies: Comment[];

    @Column()
    pageNum: number;

    @Column()
    content!: string;

    @Column({nullable: true})
    user!: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

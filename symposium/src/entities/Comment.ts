import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Column,
    BaseEntity,
    ManyToOne,
    ManyToMany,
    JoinTable
} from "typeorm";
import { Version } from "./Version";
import { User } from "./User";

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

    @ManyToMany(() => User, { eager: true })
    @JoinTable()
    likes: User[]

    @ManyToMany(() => User, { eager: true })
    @JoinTable()
    dislikes: User[]

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

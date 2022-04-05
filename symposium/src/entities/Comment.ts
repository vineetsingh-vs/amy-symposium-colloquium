import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
    ManyToOne,
} from "typeorm";
import { Version } from "./Version";
import { Review } from "./Review";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    paper_id!: number;

    @ManyToOne(() => Version, (paper_version) => paper_version.comments)
    paper_version!: number;

    @ManyToOne(() => Review, (review) => review.comments )
    review!: number;

    @Column()
    content!: string;

    @Column()
    parent!: string

    @Column()
    user!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
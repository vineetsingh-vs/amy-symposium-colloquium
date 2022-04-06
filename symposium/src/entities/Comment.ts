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

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    paper_id!: number;

    // many comments have one version
    @ManyToOne(() => Version, (version) => version.comments)
    version: Version;

    @Column()
    content!: string;

    @Column()
    parent!: string;

    @Column()
    user!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

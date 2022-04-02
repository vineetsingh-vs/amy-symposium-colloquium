import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Extra } from "./Extra";

@Entity()
export class Paper extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 60 })
    title: string;

    @Column("text")
    creator_id: string;

    @Column()
    filepath: string;

    @Column("text", { array: true })
    authors: string[];

    @Column("text", { array: true })
    tags: string[]

    @Column("text", { array: true })
    revisions: string[];
    
    @Column("boolean", { default: true })
    isPublished: boolean = false;

    @OneToMany('Extra', (extra: Extra) => extra.paper, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        eager: true
    })
    @JoinColumn()
    extras: Extra[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    versionNumber: number
}
import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
} from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    versionNumber: number
}
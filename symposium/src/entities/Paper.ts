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
import { Version } from "./Version";
import { Review } from "./Review";
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
    tags: string[];

    @Column("text", { array: true })
    revisions: string[];

    @Column("boolean", { default: true })
    isPublished: boolean = false;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    versionNumber: number;

    /**One Paper has many versions */
    @OneToMany(() => Version, (version) => version.paper)
    versions: Version[];

    /**One Paper has many reviews */
    @OneToMany(() => Review, (review) => review.paper_id)
    reviews: Review[];
}

import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Paper } from "./Paper"
import { Comment } from "./Comment";


@Entity()
export class Version {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    filepath: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**Many Versions have one paper */
    @ManyToOne(() => Paper, (parentid) => parentid.versions)
    parentid: string

    /**One Version has many comments */
    @OneToMany(() => Comment, (comment) => comment.paper_version)
    comments: Comment[]


}
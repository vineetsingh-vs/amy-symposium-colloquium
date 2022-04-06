import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Version } from "./Version";
import { User } from "./User";

@Entity()
export class Paper extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 60 })
    title: string;

    @ManyToOne(() => User, (user) => user.papers)
    creator: User;

    // TODO: create ManyToMany sharing with users
    // @Column("text", { array: true })
    // shared: User[];

    // TODO: create ManyToMany authors and papers
    // @Column("text", { array: true })
    // authors: User[];

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
}

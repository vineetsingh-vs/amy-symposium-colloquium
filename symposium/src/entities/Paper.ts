import {
    Entity,
    BaseEntity,
    Column,
    JoinTable,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    VersionColumn,
    OneToMany,
    ManyToMany,
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

    @ManyToMany(() => User)
    @JoinTable()
    authors: User[];

    @ManyToMany(() => User)
    @JoinTable()
    sharedWith: User[];

    @Column("boolean", { default: true })
    isPublished: boolean = false;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    versionNumber: number;

    @OneToMany(() => Version, (version) => version.paper)
    versions: Version[];
}

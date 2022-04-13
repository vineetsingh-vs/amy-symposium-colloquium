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
    title!: string;

    @ManyToOne(() => User, (user) => user.papers)
    creator!: User;

    @Column("text", { array: true })
    authors!: string[];

    @ManyToMany(() => User)
    @JoinTable()
    sharedWith: User[];

    @Column("boolean", { default: false })
    isPublished: boolean = false;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column("int", { default: 1 })
    versionNumber: number;

    @OneToMany(() => Version, (version) => version.paper, {
        eager: true
    })
    versions!: Version[];
}

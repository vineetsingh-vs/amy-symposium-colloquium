import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
} from "typeorm";

@Entity()
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    paper_id!: number;

    @Column()
    paper_version!: number;

    @Column()
    content!: string;

    @Column()
    user!: number;

    @Column("text", { array: true })
    comments!: string[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
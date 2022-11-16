import {
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Column,
    BaseEntity
} from "typeorm";

@Entity()
export class PaperReviewAuth extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    redirect_url: string;

    @UpdateDateColumn()
    time_to_live: Date;

    @Column()
    visited: boolean;
}

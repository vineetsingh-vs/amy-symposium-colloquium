import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    affiliation!: string;

    @Column("text", { array: true })
    roles!: string[];

    // TODO:
    // col for papers (oneToMany)
    // col for comments (oneToMany)
    // col for reviews (oneToMany)

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

// model User {
// affiliation String?
// comments    Comment[]
// createdAt   DateTime  @default(now())
// firstName   String?
// id          String    @id @default(cuid())
// lastName    String?
// papers      Paper[]
// password    String
// reviews     Review[]
// roles       String[]
// updatedAt   DateTime  @updatedAt
// username    String    @unique
// }

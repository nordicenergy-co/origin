import { MigrationInterface, QueryRunner } from 'typeorm';

export class OwnershipCommitment1599723815753 implements MigrationInterface {
    name = 'OwnershipCommitment1599723815753';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "certificate" RENAME COLUMN "privateOwners" TO "latestCommitment"`
        );
        await queryRunner.query(
            `ALTER TABLE "certificate" ALTER COLUMN "latestCommitment" DROP NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "certificate" ALTER COLUMN "latestCommitment" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "certificate" RENAME COLUMN "latestCommitment" TO "privateOwners"`
        );
    }
}

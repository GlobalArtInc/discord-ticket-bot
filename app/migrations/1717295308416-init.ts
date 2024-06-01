import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717295308416 implements MigrationInterface {
    name = 'Init1717295308416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ticket" (
                "id" SERIAL NOT NULL,
                "channel_id" character varying,
                "message_id" character varying,
                "creator_id" character varying NOT NULL,
                "created_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "closed_by" character varying,
                "closed_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "ticket"
        `);
    }

}

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('genus').notNullable();
    table.string('andress').notNullable();
    table.string('phone').notNullable();
    table.string('mail').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}

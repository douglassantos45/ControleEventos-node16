import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('insitutions', (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('city').notNullable();
    table.string('country').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('insitutions');
}

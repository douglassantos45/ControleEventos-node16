import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('INTITUTIONS', (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('city').notNullable();
    table.string('country').notNullable();

    table
      .timestamp('createdAt')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
    table
      .timestamp('updatedAt')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('INSTITUTIONS');
}

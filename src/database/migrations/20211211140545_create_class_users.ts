import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('USERS', (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('genus').notNullable();
    table.string('cep').notNullable();
    table.string('street').notNullable();
    table.string('phone').notNullable();
    table.string('mail').notNullable();
    table.string('password').notNullable();

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
  return knex.schema.dropTable('USERS');
}

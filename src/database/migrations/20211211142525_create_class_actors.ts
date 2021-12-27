import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ACTORS', (table) => {
    table.increments('id').notNullable();
    table.string('type').notNullable();

    table
      .integer('userId')
      .notNullable()
      .references('id')
      .inTable('USERS')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.integer('institutionId').references('id').inTable('INSTITUTIONS');

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
  return knex.schema.dropTable('ACTORS');
}

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('COMMITTIEES', (table) => {
    table.increments('id').notNullable();

    table
      .integer('coordenatorId')
      .notNullable()
      .references('id')
      .inTable('ACTORS')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

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
  return knex.schema.dropTable('COMMITTIEES');
}

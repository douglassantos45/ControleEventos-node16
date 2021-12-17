import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('committiees', (table) => {
    table.increments('id').notNullable();

    table
      .integer('coordenator_id')
      .notNullable()
      .references('id')
      .inTable('actors')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('committiees');
}

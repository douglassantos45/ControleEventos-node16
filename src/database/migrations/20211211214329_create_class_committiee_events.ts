import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('COMMITTIEES_EVENTS', (table) => {
    table.increments('id').notNullable();

    table
      .integer('committieeId')
      .notNullable()
      .references('id')
      .inTable('COMMITTIEES')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('eventId')
      .notNullable()
      .references('id')
      .inTable('EVENTS')
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
  return knex.schema.dropTable('COMMITTIEE_EVENTS');
}

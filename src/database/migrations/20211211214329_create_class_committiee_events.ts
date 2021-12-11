import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('committiee_events', (table) => {
    table.increments('id').notNullable();

    table
      .timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();

    table
      .integer('committiee_id')
      .notNullable()
      .references('id')
      .inTable('committiees')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('event_id')
      .notNullable()
      .references('id')
      .inTable('events')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('committiee_events');
}

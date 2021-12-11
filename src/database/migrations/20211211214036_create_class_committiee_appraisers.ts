import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('event_topics', (table) => {
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
      .integer('appraiser_id')
      .notNullable()
      .references('id')
      .inTable('actors')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('event_topics');
}

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('articles', (table) => {
    table.increments('id').notNullable();
    table.string('name').notNullable();
    table.string('federation').notNullable();
    table.string('deadline').notNullable();
    table.string('start').notNullable();
    table.string('end').notNullable();

    table
      .timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();

    table
      .integer('coordenator_id')
      .notNullable()
      .references('id')
      .inTable('actors')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('articles');
}

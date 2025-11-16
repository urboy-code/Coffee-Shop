/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable(
    'cart_itmes',
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('uuid_generate_v4()'),
      },
      cart_id: {
        type: 'uuid',
        notNull: true,
        references: 'carts',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: 'uuid',
        notNull: true,
        references: 'products',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: 'integer',
        notNull: true,
        default: 1,
      },
    },
    {
      constraints: {
        unique: ['cart_id', 'product_id'],
      },
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('cart_items');
};

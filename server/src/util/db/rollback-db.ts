import { sequelize } from './initialize-db';
import { getMigrator } from './migrator-db';

const MIGRATION_TO_ROLLBACK = '20251028131600-add-release-date-index-media.ts';

const runRollback = async () => {
  const migrator = getMigrator();

  console.log(`Rolling back: ${MIGRATION_TO_ROLLBACK}`);

  try {
    const executedMigrations = await migrator.executed();
    const isApplied = executedMigrations.some(
      (m) => m.name === MIGRATION_TO_ROLLBACK
    );

    if (!isApplied) {
      console.log('Migration was not applied. Nothing to rollback.');
      return;
    }

    await sequelize.transaction(async () => {
      await migrator.down({ migrations: [MIGRATION_TO_ROLLBACK] });
    });

    console.log('✅ Rollback successful!');
  } catch (error) {
    console.error('❌ Rollback failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

runRollback();

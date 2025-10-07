import { db } from '.';
import { classes, actions } from './schema';

function getClassId(insertedClasses: { id: number; name: string }[], className: string): number {
  const found = insertedClasses.find((c) => c.name === className);
  if (!found) {
    throw new Error(`Class "${className}" が見つかりません`);
  }
  return found.id;
}

async function resetDatabase() {
  await db.transaction(async (tx) => {
    await tx.delete(actions).execute();
    await tx.delete(classes).execute();
  });
}

async function seedDatabase() {
  const insertedClasses = await db
    .insert(classes)
    .values([{ name: 'ハンター' }, { name: 'レンジャー' }, { name: 'フォース' }])
    .returning();

  const hunterId = getClassId(insertedClasses, 'ハンター');
  const rangerId = getClassId(insertedClasses, 'レンジャー');
  const forceId = getClassId(insertedClasses, 'フォース');

  await db.insert(actions).values([
    { name: 'スラッシュアーツ', power: 120, frames: 30, maxUsage: 1, buffer: 5, classId: hunterId },
    { name: 'ガンブレイク', power: 80, frames: 25, maxUsage: 2, buffer: 3, classId: hunterId },
    {
      name: 'ライフルショット',
      power: 60,
      frames: 20,
      maxUsage: 999,
      buffer: 2,
      classId: rangerId,
    },
    { name: 'テクニック', power: 150, frames: 50, maxUsage: 1, buffer: 0, classId: forceId },
    {
      name: 'フォトンブラスト',
      power: 300,
      frames: 100,
      maxUsage: 1,
      buffer: 10,
      classId: hunterId,
    },
  ]);
}
async function main() {
  await resetDatabase();
  await seedDatabase();
}

main().then(() => console.log('完了'));

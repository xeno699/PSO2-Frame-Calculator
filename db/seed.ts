import { db } from '.';
import { classes, actions } from './schema';

async function main() {
  const insertedClasses = await db
    .insert(classes)
    .values([
      { name: 'ハンター' },
      { name: 'レンジャー' },
      { name: 'フォース' },
    ])
    .returning();

  const hunterId = insertedClasses.find(c => c.name === 'ハンター')?.id!;
  const rangerId = insertedClasses.find(c => c.name === 'レンジャー')?.id!;
  const forceId = insertedClasses.find(c => c.name === 'フォース')?.id!;

  await db.insert(actions).values([
    { name: 'スラッシュアーツ', power: 120, frames: 30, maxUsage: 1, buffer: 5, classId: hunterId },
    { name: 'ガンブレイク', power: 80, frames: 25, maxUsage: 2, buffer: 3, classId: hunterId },
    { name: 'ライフルショット', power: 60, frames: 20, maxUsage: 999, buffer: 2, classId: rangerId },
    { name: 'テクニック', power: 150, frames: 50, maxUsage: 1, buffer: 0, classId: forceId },
    { name: 'フォトンブラスト', power: 300, frames: 100, maxUsage: 1, buffer: 10, classId: hunterId },
  ]);
}

main().then(() => console.log('完了'));

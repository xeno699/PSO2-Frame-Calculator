import { db } from '.';
import { classes, actions } from './schema';
import { actionData } from './actionData';
// import axios from 'axios';
// import * as cheerio from 'cheerio';

async function restoreDatabase() {
  await db.transaction(async (tx) => {
    await tx.delete(actions).execute();
    await tx.delete(classes).execute();
  });
}

// screping logic is commented out for now

// async function fetchActionData(): Promise<ActionScrape[]> {
//   const url =
//     'https://pso2ngs.swiki.jp/index.php?%E3%83%86%E3%82%AF%E3%83%8B%E3%83%83%E3%82%AF%2F%E5%8B%95%E4%BD%9C%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E6%95%B0';
//   const { data } = await axios.get(url);
//   if (!data) throw new Error('ページの取得に失敗しました');
//   const $ = cheerio.load(data);

//   const actionsData: ActionScrape[] = [];
//   $('table.style_table tbody tr').each((i, row) => {
//     const cells = $(row).find('td');
//     if (cells.length > 0) {
//       console.log('-----cell[0]-----');
//       console.log($(cells[0]).text().trim());
//       console.log('-----cell[1]-----');
//       console.log($(cells[1]).text().trim());
//       console.log('-----cell[2]-----');
//       console.log($(cells[2]).text().trim());
//       console.log('-----cell[3]-----');
//       console.log($(cells[3]).text().trim());

//       const name = $(cells[0]).text().trim();
//       const power = parseInt($(cells[1]).text().trim(), 10);
//       const frames = parseInt($(cells[2]).text().trim(), 10);
//       const maxUsage = 1;
//       const className = 'フォース'; // 固定値

//       actionsData.push({ name, power, frames, maxUsage, className });
//     }
//   });

//   return actionsData;
// }

async function seedDatabase() {
  const insertedClasses = await db
    .insert(classes)
    .values([
      { name: 'ハンター' },
      { name: 'レンジャー' },
      { name: 'フォース' },
      { name: 'バウンサー' },
      { name: 'ガンナー' },
      { name: 'テクター' },
      { name: 'ファイター' },
    ])
    .returning();

  const classIds = insertedClasses.reduce<{ [key: string]: number }>((acc, { id, name }) => {
    acc[name] = id;
    return acc;
  }, {});

  const actionsToInsert = actionData.map(({ name, power, frames, maxUsage, className }) => ({
    name,
    power,
    frames,
    maxUsage,
    classId: classIds[className],
  }));

  await db.insert(actions).values(actionsToInsert);
}

async function main() {
  await restoreDatabase();
  console.log('データベースのリストアが完了しました');
  await seedDatabase();
  console.log('データベースのシーディングが完了しました');
}

main().catch((error) => {
  console.error('エラーが発生しました:', error);
});

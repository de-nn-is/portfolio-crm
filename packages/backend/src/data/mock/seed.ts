import { generateMockData } from './generator';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Script to generate and save mock data to JSON file
 * Run with: pnpm tsx src/data/mock/seed.ts
 */
async function seed() {
  console.log('🌱 Generating mock data...');

  const data = await generateMockData();

  const jsonPath = path.join(__dirname, '../json/db.json');
  const dir = path.dirname(jsonPath);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));

  console.log('✅ Mock data generated successfully!');
  console.log(`📁 Saved to: ${jsonPath}`);
  console.log(`👤 Users: ${data.users.length}`);
  console.log(`👥 Customers: ${data.customers.length}`);
  console.log(`💼 Deals: ${data.deals.length}`);
}

seed().catch(console.error);

import { NotFoundException } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'Plumbing',
    description: 'All plumbing related services including pipe repairs, installation, and maintenance',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Electrical',
    description: 'Electrical installation, repairs, and maintenance services',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Carpentry',
    description: 'Woodworking, furniture repairs, and custom carpentry services',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting services for residential and commercial properties',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedCategories() {
    try {
        if(!process.env.DATABASE_URL||!process.env.DATABASE_NAME){
            throw new NotFoundException('DATABASE_URL and DATABASE_NAME must be set');
        }
      const client = await MongoClient.connect(process.env.DATABASE_URL);
      const db = client.db(process.env.DATABASE_NAME);
      
      const categoriesCollection = db.collection('categories');
      let created = 0;
      let updated = 0;
  
      // Process each category
      for (const category of categories) {
        const existingCategory = await categoriesCollection.findOne({ name: category.name });
        
        if (existingCategory) {
          // Update existing category
          await categoriesCollection.updateOne(
            { name: category.name },
            { 
              $set: {
                description: category.description,
                updatedAt: new Date()
              }
            }
          );
          updated++;
        } else {
          // Create new category
          await categoriesCollection.insertOne(category);
          created++;
        }
      }
      
      console.log(`Categories seeding completed:`);
      console.log(`- Created: ${created} categories`);
      console.log(`- Updated: ${updated} categories`);
      
      await client.close();
    } catch (error) {
      console.error('Error seeding categories:', error);
      process.exit(1);
    }
  }
  
  seedCategories();
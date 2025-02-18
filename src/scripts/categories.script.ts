import { NotFoundException } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'Plumbing',
    description: 'All plumbing related services including pipe repairs, installation, and maintenance',
    blueCollars: [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        experience: 8,
        hourlyRate: 45,
        skills: ['Pipe Repair', 'Water Heater Installation', 'Drain Cleaning'],
        rating: 4.8
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1234567891',
        experience: 5,
        hourlyRate: 40,
        skills: ['Leak Detection', 'Fixture Installation', 'Emergency Repairs'],
        rating: 4.6
      }
    ]
  },
  {
    name: 'Electrical',
    description: 'Electrical installation, repairs, and maintenance services',
    blueCollars: [
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+1234567892',
        experience: 10,
        hourlyRate: 55,
        skills: ['Wiring', 'Circuit Installation', 'Safety Inspection'],
        rating: 4.9
      },
      {
        name: 'David Brown',
        email: 'david.brown@example.com',
        phone: '+1234567893',
        experience: 7,
        hourlyRate: 50,
        skills: ['Panel Upgrades', 'Lighting Installation', 'Troubleshooting'],
        rating: 4.7
      }
    ]
  },
  {
    name: 'Carpentry',
    description: 'Woodworking, furniture repairs, and custom carpentry services',
    blueCollars: [
      {
        name: 'Tom Anderson',
        email: 'tom.anderson@example.com',
        phone: '+1234567894',
        experience: 12,
        hourlyRate: 48,
        skills: ['Custom Furniture', 'Cabinet Making', 'Wood Restoration'],
        rating: 4.8
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '+1234567895',
        experience: 6,
        hourlyRate: 42,
        skills: ['Framing', 'Door Installation', 'Deck Building'],
        rating: 4.5
      }
    ]
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting services for residential and commercial properties',
    blueCollars: [
      {
        name: 'Lisa Martinez',
        email: 'lisa.martinez@example.com',
        phone: '+1234567896',
        experience: 9,
        hourlyRate: 38,
        skills: ['Interior Painting', 'Exterior Painting', 'Color Consulting'],
        rating: 4.9
      },
      {
        name: 'Robert Taylor',
        email: 'robert.taylor@example.com',
        phone: '+1234567897',
        experience: 4,
        hourlyRate: 35,
        skills: ['Wall Preparation', 'Wallpaper Installation', 'Decorative Finishes'],
        rating: 4.6
      }
    ]
  }
];

async function seedCategories() {
  try {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_NAME) {
      throw new NotFoundException('DATABASE_URL and DATABASE_NAME must be set');
    }

    const client = await MongoClient.connect(process.env.DATABASE_URL);
    const db = client.db(process.env.DATABASE_NAME);
    
    let categoriesCreated = 0;
    let categoriesUpdated = 0;
    let workersCreated = 0;
    let workersUpdated = 0;

    for (const item of categories) {
      const categoriesCollection = db.collection('categories');
      const blueCollarsCollection = db.collection('blueCollars');
      
      // First handle workers to get their IDs
      const workerIds: ObjectId[] = [];
      
      for (const worker of item.blueCollars) {
        const workerData = {
          ...worker,
          categoryName: item.name,
          availability: true,
          updatedAt: new Date()
        };

        const existingWorker = await blueCollarsCollection.findOne({ email: worker.email });
        
        if (existingWorker) {
          await blueCollarsCollection.updateOne(
            { email: worker.email },
            { $set: workerData }
          );
          workerIds.push(existingWorker._id);
          workersUpdated++;
        } else {
          const result = await blueCollarsCollection.insertOne({
            ...workerData,
            createdAt: new Date()
          });
          workerIds.push(result.insertedId);
          workersCreated++;
        }
      }

      // Now handle category with worker IDs
      const categoryData = {
        name: item.name,
        description: item.description,
        blueCollarIds: workerIds,
        updatedAt: new Date()
      };

      const existingCategory = await categoriesCollection.findOne({ name: item.name });
      
      if (existingCategory) {
        await categoriesCollection.updateOne(
          { name: item.name },
          { $set: categoryData }
        );
        categoriesUpdated++;
      } else {
        await categoriesCollection.insertOne({
          ...categoryData,
          createdAt: new Date()
        });
        categoriesCreated++;
      }
    }
    
    console.log('Seeding completed:');
    console.log(`Categories - Created: ${categoriesCreated}, Updated: ${categoriesUpdated}`);
    console.log(`Workers - Created: ${workersCreated}, Updated: ${workersUpdated}`);
    
    await client.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedCategories();
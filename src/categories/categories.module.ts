import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategorySchema } from 'src/schemas/categories.schema';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    MongooseModule.forFeature([{ name: Categories.name, schema: CategorySchema }]),
  ],
})
export class CategoriesModule {}

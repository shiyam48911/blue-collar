import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories } from 'src/schemas/categories.schema';
@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories.name) private readonly categoryModel: Model<Categories>
    ) {}

    async findAll() {
        return await this.categoryModel.aggregate([
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    name: 1,
                    description: 1,
                }
            }
        ]);
    }
}
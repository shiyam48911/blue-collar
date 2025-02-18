import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Categories } from 'src/schemas/categories.schema';
@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories.name) private readonly categoryModel: Model<Categories>
    ) { }

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

    async findOne(id: string) {
        return await this.categoryModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'blueCollars',
                    let: { blueCollarIds: '$blueCollarIds' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$blueCollarIds']
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                blueCollarId: '$_id',
                                name: 1,
                                email: 1,
                                phone: 1,
                                availability: 1,
                            }
                        }
                    ],
                    as: 'blueCollars'
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    name: 1,
                    description: 1,
                    blueCollars: 1
                }
            }
        ]);
    }
}
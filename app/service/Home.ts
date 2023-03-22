import { Service } from 'egg';
import { WhereOptions } from 'sequelize';
type TableOptionType = HomeImageTableType;

/**
 * HackerNews Api Service
 */
export class HomeService extends Service {
    // 获取数据表
    get Table() {
        return this.ctx.model.HomeImage;
    }

    /**
     * list 列表
     */
    public async getList(body: any) {
        const { Op } = this.app.Sequelize;
        // console.log('data body:>> ', body);
        const page = Number.parseInt(body.page || this.config.common.page);
        const pageSize = Number.parseInt(body.pageSize || this.config.common.pageSize);


        const where: WhereOptions<TableOptionType> = {
            // parent_id: { [Op.eq]: 0 },
        };
        if (body.title) where.title = { [Op.like]: body.title };
        if (body.type) where.type = { [Op.eq]: body.type };
        if (body.screen) where.screen = { [Op.eq]: body.screen };

        const { rows, count } = await this.Table.findAndCountAll({
            where,
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [
                ['screen', 'ASC'],
            ],
        });

        return { list: rows, total: count };
    }


    /**
     * insert 新增
     */
    public async insert(body: TableOptionType) {
        return await this.Table.create(body);

    }

    // 修改数据
    async update(body: TableOptionType) {

        const _data = await this.Table.update(body, {
            where: {
                id: body.id!,
            },
        });

        return _data;

    }


    // 获取记录信息
    async info(id: number) {

        const _data = await this.Table.findByPk(id);

        return _data;

    }

    // 删除数据
    public async delete(id: number) {
        const _data = await this.Table.destroy({
            where: {
                id,
            },
        });

        // // 删除文件
        // await ctx.model.File.deleteOne({ _id: _data._id });

        return _data;

    }


}

export default HomeService;

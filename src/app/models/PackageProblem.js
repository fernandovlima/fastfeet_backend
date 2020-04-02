import Sequelize, { Model } from 'sequelize';
import SequelizePaginate from 'sequelize-paginate';

class PackageProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'package_problems',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Package, {
      foreignKey: 'package_id',
      as: 'package',
    });
  }
}
SequelizePaginate.paginate(PackageProblem);
export default PackageProblem;

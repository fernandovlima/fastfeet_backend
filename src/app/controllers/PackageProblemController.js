import { Op } from 'sequelize';
import * as Yup from 'yup';
import Package from '../models/Package';
import PackageProblem from '../models/PackageProblem';
import Deliveryman from '../models/Deliveryman';

import Mail from '../../lib/Mail';

class PackageProblemController {
  async index(req, res) {
    try {
      const problems = await PackageProblem.findAll({
        where: {
          created_at: [Op.all],
        },
      });

      if (!problems) {
        return res
          .status(401)
          .json({ error: 'No deliveries with problems available' });
      }
    } catch (error) {
      return res.json(error);
    }
    return res.json({ ok: true });
  }

  async show(req, res) {
    const { package_id } = req.params;

    const deliveryExists = await Package.findByPk(package_id);

    if (!deliveryExists) {
      return res.status(401).json({ error: 'delivery not exists' });
    }

    const packageProblems = await PackageProblem.findAll({
      where: {
        package_id,
      },
      include: [
        {
          model: Package,
          as: 'package',
          attributes: ['product', 'deliveryman_id', 'recipient_id'],
        },
      ],
    });

    return res.json(packageProblems);
  }

  async store(req, res) {
    const schema = Yup.object(req.body).shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { package_id } = req.params;
    const { description } = req.body;

    const packageExists = await Package.findByPk(package_id);

    if (!packageExists) {
      return res.status(400).json({ error: 'Package does not exists' });
    }

    const problem = await PackageProblem.create({
      description,
      package_id,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { package_id } = req.params;

    const packageProblemExists = await PackageProblem.findOne({
      where: { package_id },
    });

    if (!packageProblemExists) {
      return res.status(400).json({ error: 'There is no problem here!' });
    }

    const packageOk = await Package.findByPk(packageProblemExists.package_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (packageOk.end_date !== null && packageOk.signature_id !== null) {
      return res.status(400).json('This delivery has been completed');
    }

    if (packageOk.canceled_at !== null) {
      return res.status(400).json('This package has already been cancelled');
    }
    packageOk.update(
      {
        canceled_at: new Date(),
      },
      {
        where: {
          id: packageProblemExists.package_id,
        },
      }
    );

    await Mail.sendMail({
      to: `${packageOk.deliveryman.namel} <${packageOk.deliveryman.email}>`,
      subject: 'Package Cancelled',
      template: 'cancellation',
      context: {
        deliveryman: packageOk.deliveryman.name,
        package_id: packageOk.id,
        product: packageOk.product,
        canceled_at: packageOk.canceled_at,
      },
    });

    return res.status(200).json();
  }
}

export default new PackageProblemController();

import * as Yup from 'yup';
import { Op } from 'sequelize';
import Package from '../models/Package';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class PackageController {
  async index(req, res) {
    const { product = '' } = req.query;

    try {
      const packages = await Package.findAll({
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'street',
              'zipcode',
              'number',
              'state',
              'city',
              'complement',
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['url', 'path', 'name'],
          },
        ],
        attributes: [
          'id',
          'product',
          'deliveryman_id',
          'recipient_id',
          'canceled_at',
          'start_date',
          'end_date',
        ],
        where: {
          product: {
            [Op.iLike]: `%${product}%`,
          },
        },
      });

      return res.json(packages);
    } catch (error) {
      return res.json(error);
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });
    // valida se o schema está preenchido corretamente
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fields validation fails' });
    }

    // create package
    try {
      const { product, recipient_id, deliveryman_id } = await req.body;

      // find deliveryman
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
      // find recipient
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!(recipientExists || deliverymanExists)) {
        return res
          .status(401)
          .json({ error: 'Deliveryman and Recipient does not exists' });
      }
      if (!recipientExists) {
        return res.status(401).json({ error: 'Recipient does not exists' });
      }
      if (!deliverymanExists) {
        return res.status(401).json({ error: 'Deliveryman does not exists' });
      }

      const packageOk = await Package.create({
        product,
        deliveryman_id,
        recipient_id,
      });

      return res.json(packageOk);
    } catch (error) {
      return res.json(error);
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      avatar_id: Yup.number(),
    });
    // valida se o schema está preenchido corretamente
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fields validation fails' });
    }

    // find if package exists
    const packageExists = await Package.findOne({
      where: {
        id: req.params.package_id,
      },
    });

    if (!packageExists) {
      return res.status(401).json({ error: 'Package not exists' });
    }

    const {
      product,
      recipient_id,
      deliveryman_id,
    } = await packageExists.update(req.body);

    return res.json({ product, recipient_id, deliveryman_id });
  }

  async delete(req, res) {
    try {
      const deliveryman = await Package.findByPk(req.params.package_id);

      if (!deliveryman) {
        return res.status(401).json({ error: 'Deliveryman not exists' });
      }
      // DELETE DELIVERYMAN
      await deliveryman.destroy();

      return res.send();
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new PackageController();

import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    try {
      const deliverymans = await Deliveryman.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'url'],
          },
        ],
      });

      return res.json(deliverymans);
    } catch (error) {
      return res.json(error);
    }
  }

  async show(req, res) {
    try {
      const deliverymans = await Deliveryman.findByPk(
        req.params.deliveryman_id,
        {
          attributes: ['id', 'name', 'email', 'avatar_id', 'created_at'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'url', 'path'],
            },
          ],
        }
      );

      return res.json(deliverymans);
    } catch (error) {
      return res.json(error);
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.number().required(),
    });
    // valida se o schema está preenchido corretamente
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fields validation fails' });
    }

    // find if deliveryman exists
    const deliverymanExists = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman already exists' });
    }

    // create deliveryman
    try {
      const deliveryman = await Deliveryman.create(req.body);
      return res.json(deliveryman);
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

    // find if deliveryman exists
    const deliveryman = await Deliveryman.findByPk(req.params.deliveryman_id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not exists' });
    }
    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } });
      if (deliverymanExists) {
        return res.status(401).json({ error: 'Deliveryman already exists' });
      }
    }

    const { id, name, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    try {
      const deliveryman = await Deliveryman.findByPk(req.params.deliveryman_id);

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

export default new DeliverymanController();

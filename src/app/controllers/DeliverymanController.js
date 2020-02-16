import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    try {
      const deliverymans = await Deliveryman.findAll();

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
      const { name, email, avatar_id } = await Deliveryman.create(req.body);
      return res.json({
        name,
        email,
        avatar_id,
      });
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
    const deliveryman = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not exists' });
    }

    const { name, email, avatar_id } = await deliveryman.update(req.body);

    return res.json({ name, email, avatar_id });
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

import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  endOfDay,
  startOfDay,
  parseISO,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Package from '../models/Package';
import File from '../models/File';

class PackageStatusController {
  async index(req, res) {
    const deliverymanExists = await Deliveryman.findOne({
      id: req.body.deliveryman_id,
    });

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }

    const deliveries = await Package.findAll();
    return res.json(deliveries);
  }

  async show(req, res) {
    const { deliveryman_id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk({ deliveryman_id });

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exist.' });
    }
    const deliveries = await Package.findAll({
      where: {
        end_date: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'path', 'name'],
        },
      ],
    });
    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object(req.body).shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const startDate = parseISO(req.body.start_date);
    const endDate = parseISO(req.body.end_date);

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    if (isBefore(endDate, startDate)) {
      return res
        .status(400)
        .json({ error: 'Delivery date must be after the withdrawal date' });
    }
    const startInterval = setSeconds(setMinutes(setHours(startDate, 8), 0), 0);
    const endInterval = setSeconds(setMinutes(setHours(startDate, 18), 0), 0);

    if (isAfter(startDate, endInterval) || isBefore(startDate, startInterval)) {
      return res.status(400).json({
        error: 'The access is permitted only between 08:00 and 18:00h',
      });
    }

    const { deliveryman_id, delivery_id } = req.params;

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    const deliveryExists = await Package.findOne({
      where: { id: delivery_id },
    });

    if (!deliverymanExists && !deliveryExists) {
      return res
        .status(400)
        .json({ error: 'Delivery and Deliveryman does not exists' });
    }

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const deliverymanPackages = await Package.findOne({
      where: { id: delivery_id, deliveryman_id },
    });

    if (!deliverymanPackages) {
      return res.status(401).json({
        error: 'This Delivery does not belogs to Deliveryman',
      });
    }

    const ordersPickupInDay = await Package.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(startDate), endOfDay(startDate)],
        },
      },
    });

    const arrayOfIds = ordersPickupInDay.map(order => order.id);

    if (
      ordersPickupInDay.length < 5 ||
      arrayOfIds.includes(Number(delivery_id))
    ) {
      const data = await deliverymanPackages.update(req.body, {
        attributes: [
          'id',
          'product',
          'recipient_id',
          'canceled_at',
          'start_date',
          'end_date',
          'signature_id',
        ],
      });

      return res.json(data);
    }

    return res
      .status(401)
      .json({ error: 'The limit is 5 per day, can back tomorrow!' });
  }
}

export default new PackageStatusController();

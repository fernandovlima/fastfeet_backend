import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    return res.json({ ok: 'true' });
  }

  async store(req, res) {
    return res.json({ ok: 'true' });
  }

  async update(req, res) {
    return res.json({ ok: 'true' });
  }

  async delete(req, res) {
    return res.json({ ok: 'true' });
  }
}

export default new DeliverymanController();

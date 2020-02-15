import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    // validation schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fail' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({ name, street, number, complement, state, city, zipcode });
  }
}

export default new RecipientController();

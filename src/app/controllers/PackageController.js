import * as Yup from 'yup';
import Package from '../models/Package';

class PackageController {
  async index(req, res) {
    try {
      const packages = await Package.findAll();

      return res.json(packages);
    } catch (error) {
      return res.json(error);
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });
    // valida se o schema está preenchido corretamente
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fields validation fails' });
    }

    // find if package exists
    const packageExists = await Package.findByPk(req.params);

    if (packageExists) {
      return res.status(401).json({ error: 'package already exists' });
    }

    // create package
    try {
      const { name, email, avatar_id } = await Package.create(req.body);
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

    // find if package exists
    const packageExists = await Package.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!packageExists) {
      return res.status(401).json({ error: 'Package not exists' });
    }

    const { name, email, avatar_id } = await packageExists.update(req.body);

    return res.json({ name, email, avatar_id });
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

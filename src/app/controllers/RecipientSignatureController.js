import RecipientSignature from '../models/RecipientSignature';

class RecipientSignatureController {
  async index(req, res) {
    const signatures = await RecipientSignature.findAll();
    return res.json(signatures);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { recipient_id } = req.params;

    const signatureExists = RecipientSignature.findOne({
      where: { recipient_id },
    });

    if (signatureExists) {
      return res.status(401).json({ error: 'Signature already exists' });
    }

    try {
      const signature = await RecipientSignature.create({
        name,
        path,
        recipient_id,
      });

      return res.json(signature);
    } catch (error) {
      return res.json(error);
    }
  }

  async update(req, res) {
    const { recipient_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    const signature = RecipientSignature.findOne({ where: { recipient_id } });

    if (!signature) {
      res.status(401).json({ error: 'Signature does not exists' });
    }

    await signature.update({ name, path });

    return res.json({ name, path, recipient_id });
  }

  async delete(req, res) {
    try {
      const signature = await RecipientSignature.findByPk(
        req.params.signature_id
      );

      if (!signature) {
        return res.status(401).json({ error: 'Deliveryman not exists' });
      }
      // DELETE signature
      await signature.destroy();

      return res.send();
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new RecipientSignatureController();

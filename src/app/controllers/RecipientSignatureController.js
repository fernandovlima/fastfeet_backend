import RecipientSignature from '../models/RecipientSignature';

class RecipientSignatureController {
  async index(req, res) {
    const signatures = await RecipientSignature.findAll();
    return res.json(signatures);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const { recipient_id } = req.params;

    const signatureExists = RecipientSignature.findByPk(recipient_id);

    if (signatureExists) {
      res.status(401).json({ error: 'Signature already exists' });
    }

    const signature = await RecipientSignature.create({
      name,
      path,
      recipient_id,
    });

    return res.json(signature);
  }

  async update(req, res) {
    return res.json({ ok: 'true' });
  }

  async delete(req, res) {
    return res.json({ ok: 'true' });
  }
}

export default new RecipientSignatureController();

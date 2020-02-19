import File from '../models/File';

class FileController {
  async index(req, res) {
    try {
      const files = await File.findAll();
      if (!files) {
        return res.status(401).json({ error: 'No files found' });
      }

      return res.json(files);
    } catch (error) {
      return res.json(error);
    }
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();

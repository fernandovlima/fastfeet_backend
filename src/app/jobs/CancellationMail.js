import { parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class Cancellationmail {
  key() {
    return 'CancelationMail';
  }

  async handle({ data }) {
    const { packageOk } = data;
    await Mail.sendMail({
      to: `${packageOk.deliveryman.namel} <${packageOk.deliveryman.email}>`,
      subject: 'Package Cancelled',
      template: 'cancellation',
      context: {
        deliveryman: packageOk.deliveryman.name,
        package_id: packageOk.id,
        product: packageOk.product,
        canceled_at: parseISO(packageOk.canceled_at),
      },
    });
  }
}

export default new Cancellationmail();

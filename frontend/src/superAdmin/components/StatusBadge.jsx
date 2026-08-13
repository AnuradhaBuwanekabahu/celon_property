import { stamp } from '../lib/ui';

export default function StatusBadge({ status }) {
  return <span className={stamp(status)}>{status || 'unknown'}</span>;
}

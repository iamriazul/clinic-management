export default function StatusBadge({ status }) {
  const badgeClass = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  }[status] || 'badge-pending';

  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
}

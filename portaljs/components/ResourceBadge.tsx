import { clsx } from 'clsx';

interface ResourceBadgeProps {
  format: string;
}

const formatColors: Record<string, string> = {
  CSV: 'bg-green-100 text-green-800',
  JSON: 'bg-blue-100 text-blue-800',
  XML: 'bg-purple-100 text-purple-800',
  PDF: 'bg-red-100 text-red-800',
  XLS: 'bg-emerald-100 text-emerald-800',
  XLSX: 'bg-emerald-100 text-emerald-800',
  ZIP: 'bg-yellow-100 text-yellow-800',
  HTML: 'bg-orange-100 text-orange-800',
  GEOJSON: 'bg-cyan-100 text-cyan-800',
  SHP: 'bg-teal-100 text-teal-800',
  API: 'bg-indigo-100 text-indigo-800',
};

export default function ResourceBadge({ format }: ResourceBadgeProps) {
  const upperFormat = format?.toUpperCase() || 'UNKNOWN';
  const colorClass = formatColors[upperFormat] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase',
        colorClass
      )}
    >
      {upperFormat}
    </span>
  );
}

// Shared Tailwind utility strings, mirroring the original .btn / .panel / .data-table
// classes so every page composes the same look consistently.

const BTN_BASE =
  'inline-flex items-center justify-center gap-1.5 border border-transparent rounded-radius px-3.5 py-2 text-[13px] font-medium hover:brightness-[0.97] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto';

const BTN_VARIANTS = {
  default: 'bg-surface-sunken text-ink',
  primary: 'bg-teal text-white hover:bg-teal-deep',
  accent: 'bg-[#14213D] text-white hover:bg-clay',
  danger: 'bg-danger-bg text-danger hover:bg-[#f0d2ce]',
  ghost: 'bg-transparent border-line hover:border-ink-soft',
};

export function btn(variant = 'default', { sm = false, extra = '' } = {}) {
  return [
    BTN_BASE,
    BTN_VARIANTS[variant] || '',
    sm ? 'px-2.5 py-[5px] text-xs sm:w-auto' : '',
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

export const panel =
  'bg-surface border border-line rounded-radius shadow-card overflow-x-auto';

export const panelHeader =
  'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-4 border-b border-line';

export const panelHeaderMeta =
  'text-xs text-ink-soft w-full sm:w-auto';

export const statGrid =
  'grid gap-3.5 mb-7 grid-cols-1 sm:grid-cols-2 xl:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]';

export const dataTable =
  'w-full min-w-[700px] border-collapse text-[13px]';

export const th =
  'text-left text-[10.5px] uppercase tracking-[0.08em] text-ink-soft px-3 sm:px-5 py-2.5 border-b border-line bg-surface-sunken whitespace-nowrap';

export const td =
  'px-3 sm:px-5 py-3 border-b border-line align-middle whitespace-nowrap';

export const trHover =
  'hover:bg-[#C1622D]/[0.04] last:[&>td]:border-b-0';

export const cellTitle = 'font-medium text-teal-deep';

export const cellSub =
  'text-[11.5px] text-ink-soft break-words';

export const cellMono =
  'font-mono text-[12.5px] break-all';

export const actionsCell =
  'flex flex-wrap sm:flex-nowrap gap-1.5 justify-start sm:justify-end';

export const emptyState =
  'px-5 py-[60px] text-center text-ink-soft';

export const emptyStateGlyph =
  'font-display text-[34px] text-line mb-2';

export const loadingState =
  'p-10 text-center text-ink-soft text-[13px]';

export const searchBar =
  'flex flex-col sm:flex-row gap-2 items-stretch sm:items-center';

export const searchInput =
  'w-full sm:min-w-[220px] px-3 py-[7px] border border-line rounded-radius text-[13px] bg-surface';

export const tabs =
  'flex overflow-x-auto whitespace-nowrap gap-1 px-3 sm:px-5 border-b border-line';

export const tabBtn = (active) =>
  'bg-transparent border-none px-3.5 py-3 text-[13px] -mb-px border-b-2 flex-shrink-0 ' +
  (active
    ? 'text-teal-deep border-clay font-medium'
    : 'text-ink-soft border-transparent');

export const fieldRow =
  'grid grid-cols-1 sm:grid-cols-2 gap-3';

export const stampBase =
  "inline-flex items-center gap-[5px] font-mono text-[11px] tracking-[0.03em] pt-[3px] pb-[3px] pl-[7px] pr-[9px] rounded-[20px] border border-current before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current";

export const STAMP_VARIANTS = {
  pending: 'text-gold bg-pending-bg',
  active: 'text-success bg-success-bg',
  sold: 'text-ink-soft bg-surface-sunken',
  rented: 'text-ink-soft bg-surface-sunken',
  closed: 'text-ink-soft bg-surface-sunken',
  paid: 'text-success bg-success-bg',
  failed: 'text-danger bg-danger-bg',
  approved: 'text-success bg-success-bg',
};

export function stamp(status) {
  const key = String(status || '').toLowerCase();
  return `${stampBase} ${STAMP_VARIANTS[key] || ''}`;
}
import type { PortfolioProject } from '../../domain/portfolio.types';

export function ProjectPreviewSvg({ project }: { project: PortfolioProject }) {
  const presets: Record<string, { icon: string; motif: string; accent: string }> = {
    'veterinary-web': { icon: '🐾', motif: 'Pet records • Appointments • Medical history', accent: '#22c55e' },
    'song-manager': { icon: '🎵', motif: 'Tracks • Playlists • Metadata manager', accent: '#a855f7' },
    'ai-integration': { icon: '🤖', motif: 'Prompts • AI workflows • Smart automation', accent: '#06b6d4' },
    'spend-flow': { icon: '💸', motif: 'Budgeting • Expenses • Cash-flow control', accent: '#f59e0b' },
    'owney-beauty': { icon: '💄', motif: 'Bookings • Catalog • Client loyalty', accent: '#ec4899' },
    'b2b-maui': { icon: '📱', motif: 'Field sales • Sync • Business operations', accent: '#3b82f6' },
    'erp-modernization': { icon: '🧩', motif: 'Modular ERP • Refactor • Migration', accent: '#14b8a6' },
    'desktop-operations': { icon: '🖥️', motif: 'Internal workflows • Reporting suite', accent: '#6366f1' },
    'enterprise-apis': { icon: '🔌', motif: 'Secure APIs • Integrations • Contracts', accent: '#0ea5e9' },
    'xamarin-enhancements': { icon: '🛠️', motif: 'Legacy support • PDF • XML automation', accent: '#f97316' }
  };

  const preset = presets[project.id] ?? { icon: '🚀', motif: project.type, accent: '#1387c1' };
  const bg = '#0f1b22';

  return (
    <svg viewBox="0 0 640 360" role="img" aria-label={project.title} className="portfolio-svg-preview" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g-${project.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor="#17303d" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="22" fill={`url(#g-${project.id})`} />
      <circle cx="548" cy="90" r="78" fill={`${preset.accent}33`} />
      <circle cx="102" cy="290" r="92" fill={`${preset.accent}22`} />
      <rect x="32" y="30" width="576" height="50" rx="12" fill="rgba(231,242,247,0.10)" />
      <text x="54" y="63" fill="#e7f2f7" fontSize="22" fontFamily="Poppins, sans-serif">{preset.icon} {project.title}</text>
      <rect x="44" y="96" width="380" height="16" rx="7" fill="rgba(231,242,247,0.24)" />
      <rect x="44" y="121" width="330" height="12" rx="6" fill="rgba(231,242,247,0.14)" />
      <text x="48" y="107" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">{project.type}</text>
      <text x="48" y="129" fill={preset.accent} fontSize="11" fontFamily="Poppins, sans-serif">{preset.motif}</text>

      <rect x="44" y="160" width="168" height="136" rx="12" fill={`${preset.accent}24`} stroke={`${preset.accent}77`} />
      <rect x="236" y="160" width="168" height="136" rx="12" fill="rgba(231,242,247,0.08)" stroke="rgba(231,242,247,0.20)" />
      <rect x="428" y="160" width="168" height="136" rx="12" fill="rgba(231,242,247,0.06)" stroke="rgba(231,242,247,0.16)" />

      <text x="58" y="182" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">MAIN FLOW</text>
      <text x="250" y="182" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">LOGIC</text>
      <text x="440" y="182" fill="#e7f2f7" fontSize="11" fontFamily="Poppins, sans-serif">OUTPUT</text>

      <rect x="58" y="194" width="140" height="10" rx="5" fill="rgba(231,242,247,0.2)" />
      <rect x="58" y="211" width="116" height="10" rx="5" fill="rgba(231,242,247,0.14)" />
      <rect x="58" y="228" width="132" height="10" rx="5" fill="rgba(231,242,247,0.14)" />

      <circle cx="320" cy="228" r="26" fill={`${preset.accent}55`} />
      <text x="312" y="234" fill="#fff" fontSize="14" fontFamily="Poppins, sans-serif">SYS</text>

      <rect x="442" y="206" width="140" height="58" rx="10" fill={`${preset.accent}33`} />
      <text x="452" y="240" fill="#e7f2f7" fontSize="12" fontFamily="Poppins, sans-serif">{project.stack.slice(0, 2).join(' + ')}</text>

      <text x="48" y="336" fill={preset.accent} fontSize="14" fontFamily="Poppins, sans-serif">{project.tags.join(' • ')}</text>
    </svg>
  );
}

import type { UserRole } from '@/lib/api';

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  content_manager: 'Content mgr',
  instructor: 'Instructor',
  student: 'Student',
};

export function RoleChart({ byRole }: { byRole: Record<UserRole, number> }) {
  const entries = Object.entries(byRole) as [UserRole, number][];
  const max = Math.max(...entries.map(([, value]) => value), 1);

  const width = 360;
  const top = 26;
  const baseline = 140;
  const plotHeight = baseline - top;
  const slot = width / entries.length;
  const barWidth = 30;

  return (
    <div className="role-chart">
      <svg
        viewBox={`0 0 ${width} 170`}
        className="w-full"
        role="img"
        aria-label="Bar chart of user counts per role"
      >
        <defs>
          <clipPath id="role-chart-baseline">
            <rect x="0" y="0" width={width} height={baseline} />
          </clipPath>
        </defs>

        {[
          { value: max, y: baseline - plotHeight },
          { value: Math.round(max / 2), y: baseline - (Math.round(max / 2) / max) * plotHeight },
        ].map((grid) => (
          <g key={grid.value}>
            <line x1="8" x2={width - 8} y1={grid.y} y2={grid.y} className="role-chart-grid" />
            <text x={width - 8} y={grid.y - 5} textAnchor="end" className="role-chart-tick">
              {grid.value}
            </text>
          </g>
        ))}

        <line x1="8" x2={width - 8} y1={baseline} y2={baseline} className="role-chart-axis" />

        {entries.map(([role, value], index) => {
          const barHeight = value > 0 ? Math.max((value / max) * plotHeight, 3) : 0;
          const x = slot * index + (slot - barWidth) / 2;
          const y = baseline - barHeight;

          return (
            <g key={role} className="role-chart-group">
              <rect
                x={slot * index}
                y={top - 14}
                width={slot}
                height={baseline - top + 32}
                fill="transparent"
              />
              {value > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight + 4}
                  rx="4"
                  className="role-chart-bar"
                  clipPath="url(#role-chart-baseline)"
                >
                  <title>{`${roleLabels[role]}: ${value}`}</title>
                </rect>
              )}
              <text
                x={slot * index + slot / 2}
                y={y - 8}
                textAnchor="middle"
                className="role-chart-value"
              >
                {value}
              </text>
              <text
                x={slot * index + slot / 2}
                y={baseline + 18}
                textAnchor="middle"
                className="role-chart-label"
              >
                {roleLabels[role]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

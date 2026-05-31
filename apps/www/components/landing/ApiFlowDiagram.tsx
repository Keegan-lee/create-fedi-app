interface IApiFlowDiagramProps {
  className?: string;
}

/**
 * SVG diagram showing Fedi WebView injecting browser APIs into mini apps.
 */
export function ApiFlowDiagram({ className }: IApiFlowDiagramProps) {
  return (
    <svg
      viewBox="0 0 420 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Fedi injects window.webln, window.nostr, and window.fediInternal into mini apps"
    >
      {/* WebView container */}
      <rect
        x="60"
        y="20"
        width="300"
        height="72"
        rx="8"
        stroke="var(--color-border)"
        strokeWidth="1"
        fill="var(--color-surface)"
      />
      <text
        x="210"
        y="52"
        textAnchor="middle"
        fill="var(--color-text-muted)"
        fontFamily="var(--font-body)"
        fontSize="13"
      >
        Fedi in-app browser
      </text>
      <circle cx="340" cy="36" r="4" fill="var(--color-accent)" opacity="0.8" />
      <circle cx="352" cy="36" r="4" fill="var(--color-text-subtle)" />
      <circle cx="364" cy="36" r="4" fill="var(--color-text-subtle)" />

      {/* Injection arrow */}
      <path
        d="M210 92V118"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M205 113L210 120L215 113"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <text
        x="210"
        y="138"
        textAnchor="middle"
        fill="var(--color-text-subtle)"
        fontFamily="var(--font-mono)"
        fontSize="10"
      >
        injects
      </text>

      {/* API nodes */}
      {[
        { x: 70, label: 'window.webln', sub: 'Lightning payments' },
        { x: 210, label: 'window.nostr', sub: 'NIP-07 identity' },
        { x: 350, label: 'window.fediInternal', sub: 'Ecash & federation' },
      ].map(({ x, label, sub }) => (
        <g key={label}>
          <rect
            x={x - 58}
            y="155"
            width="116"
            height="88"
            rx="8"
            stroke="var(--color-border)"
            strokeWidth="1"
            fill="var(--color-surface-2)"
          />
          <rect
            x={x - 58}
            y="155"
            width="116"
            height="3"
            rx="1.5"
            fill="var(--color-accent)"
            opacity="0.5"
          />
          <text
            x={x}
            y="185"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontFamily="var(--font-mono)"
            fontSize="10"
          >
            {label}
          </text>
          <text
            x={x}
            y="210"
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontFamily="var(--font-body)"
            fontSize="11"
          >
            {sub}
          </text>
          <path
            d={`M${x} 155V132`}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>
      ))}

      {/* Mini app output */}
      <path
        d="M130 243V268M210 243V268M290 243V268"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <rect
        x="80"
        y="268"
        width="260"
        height="36"
        rx="6"
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="4 3"
        fill="var(--color-accent-dim)"
      />
      <text
        x="210"
        y="291"
        textAnchor="middle"
        fill="var(--color-text)"
        fontFamily="var(--font-display)"
        fontSize="13"
        fontWeight="600"
      >
        your mini app
      </text>
    </svg>
  );
}

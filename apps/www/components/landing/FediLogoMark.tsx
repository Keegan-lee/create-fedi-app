interface IFediLogoMarkProps {
  className?: string;
}

/** Geometric mark: federated nodes connected by Lightning. */
export function FediLogoMark({ className }: IFediLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2.5" fill="currentColor" />
      <circle cx="5" cy="17" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="19" cy="17" r="2.5" fill="currentColor" opacity="0.7" />
      <path
        d="M12 7.5V10M12 10L8.5 14M12 10L15.5 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

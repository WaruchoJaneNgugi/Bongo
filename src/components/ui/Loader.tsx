type LoaderSize = 'sm' | 'md' | 'lg';

export interface LoaderProps {
  /** Ring diameter. Default 'md'. */
  size?: LoaderSize;
  /** Optional caption shown under the ring. */
  label?: string;
  /** Cover the viewport on a page-2 background. Default false. */
  fullscreen?: boolean;
}

export function Loader({ size = 'md', label, fullscreen = false }: LoaderProps) {
  const className = `ui-loader ui-loader--${size}${fullscreen ? ' ui-loader--full' : ''}`;
  return (
    <div className={className} role="status" aria-live="polite" aria-label={label ?? 'Loading'}>
      <span className="ui-loader-ring" aria-hidden="true" />
      {label && <span className="ui-loader-label">{label}</span>}
    </div>
  );
}

export default Loader;

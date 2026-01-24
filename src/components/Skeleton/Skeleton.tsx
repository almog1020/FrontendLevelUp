import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '4px',
  className = '' 
}: SkeletonProps) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius,
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`}
      style={style}
    />
  );
};


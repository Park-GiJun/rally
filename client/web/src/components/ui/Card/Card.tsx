import type { ElementType, HTMLAttributes } from 'react';
import styles from './Card.module.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  padding?: CardPadding;
}

export function Card({
  as: Tag = 'div',
  padding = 'md',
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [styles.card, styles[`pad-${padding}`], className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export default Card;

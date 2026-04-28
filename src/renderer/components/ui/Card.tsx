import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { classNames } from "../../lib/classNames";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  title?: string;
};

export function Card({ children, className, title, ...props }: CardProps): ReactElement {
  return (
    <section className={classNames("card", className)} {...props}>
      {title ? (
        <header className="card__header">
          <h2>{title}</h2>
        </header>
      ) : null}
      {children}
    </section>
  );
}

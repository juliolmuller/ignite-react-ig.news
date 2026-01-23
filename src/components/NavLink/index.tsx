import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

export interface NavLinkProps extends LinkProps {
  activeClassName?: string;
  children: ReactNode;
  exact?: boolean;
}

export default function NavLink({
  activeClassName = '',
  children,
  exact,
  href,
  ...props
}: NavLinkProps): ReactNode {
  const { asPath } = useRouter();
  const matches = exact ? asPath === href : asPath.startsWith(href.toString());
  const actualClassName = matches ? activeClassName : '';

  return (
    <Link href={href} {...props}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={actualClassName}>{children}</a>
    </Link>
  );
}

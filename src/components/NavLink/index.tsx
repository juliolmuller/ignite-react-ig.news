/* eslint-disable jsx-a11y/anchor-is-valid */
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export interface NavLinkProps extends LinkProps {
  children: ReactNode;
  activeClassName?: string;
  exact?: boolean;
}

export default function NavLink({
  activeClassName = '',
  children,
  exact,
  href,
  ...props
}: NavLinkProps) {
  const { asPath } = useRouter();
  const matches = exact ? asPath === href : asPath.startsWith(href.toString());
  const actualClassName = matches ? activeClassName : '';

  return (
    <Link href={href} {...props}>
      <a className={actualClassName}>{children}</a>
    </Link>
  );
}

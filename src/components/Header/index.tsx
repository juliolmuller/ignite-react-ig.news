import Link from 'next/link';

import NavLink from '~/components/NavLink';
import SignInButton from '~/components/SignInButton';

import classes from './styles.module.scss';

export default function Header() {
  return (
    <header className={classes.wrapper}>
      <div className={classes.container}>
        <img src="/img/logo.svg" alt="logo for ig.news" />

        <nav>
          <NavLink href="/home" exact activeClassName={classes.active}>
            Home
          </NavLink>
          <NavLink href="/posts" activeClassName={classes.active}>
            Posts
          </NavLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

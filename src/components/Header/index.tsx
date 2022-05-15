import SignInButton from '~/components/SignInButton';

import classes from './styles.module.scss';

export default function Header() {
  return (
    <header className={classes.wrapper}>
      <div className={classes.container}>
        <img src="/img/logo.svg" alt="logo for ig.news" />

        <nav>
          <a className={classes.active} href="">
            Home
          </a>
          <a href="">Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

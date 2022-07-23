import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import classes from './styles.module.scss';

export default function SignInButton() {
  const session = useSession();

  function handleSignIn() {
    signIn('github');
  }

  function handleSignOut() {
    signOut();
  }

  return session.status === 'authenticated' ? (
    <button className={classes.wrapper} type="button">
      <FaGithub color="#04d361" />
      {session.data.user?.name}
      <FiX color="#737380" title="Sign out" onClick={handleSignOut} />
    </button>
  ) : (
    <button className={classes.wrapper} type="button" onClick={handleSignIn}>
      <FaGithub color="#eba417" />
      Sign in with GitHub
    </button>
  );
}

import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import classes from './styles.module.scss';

export default function SignInButton() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  function handleClick() {
    setAuthenticated(!isAuthenticated);
  }

  return isAuthenticated ? (
    <button className={classes.wrapper} type="button" onClick={handleClick}>
      <FaGithub color="#04d361" />
      Julio L. Muller
      <FiX color="#737380" />
    </button>
  ) : (
    <button className={classes.wrapper} type="button" onClick={handleClick}>
      <FaGithub color="#eba417" />
      Sign in with GutHub
    </button>
  );
}

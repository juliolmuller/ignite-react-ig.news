import Head from 'next/head';

import classes from './styçes.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={classes.root}>
        <img src="/img/avatar.svg" alt="girl coding React" />

        <section>
          <small className={classes.greetings}>👋 Hello, there!</small>

          <h1 className={classes.slogan}>
            News about <br />
            the <strong>React</strong> world
          </h1>

          <p className={classes.actionCall}>
            Get acess to all the publications
            <span>for $9,90/month</span>
          </p>

          <button className={classes.subscribeBtn} type="button">
            Subscribe now
          </button>
        </section>
      </main>
    </>
  );
}

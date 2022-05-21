import { Client } from 'faunadb';

const fauna = new Client({
  domain: 'db.us.fauna.com',
  secret: process.env.FAUNADB_SECRET_KEY!,
});

export default fauna;

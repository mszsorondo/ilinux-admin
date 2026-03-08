import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlTagFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<any[]>;

const sql: SqlTagFn = async (strings, ...values) => {
  const text = strings.reduce(
    (prev, curr, i) => prev + "$" + i + curr
  );
  const result = await pool.query(text, values);
  return result.rows;
};

export function getDb(): SqlTagFn {
  return sql;
}

export default pool;

import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
  user: "postgres",
  database: "postgres",
  hostname: "localhost",
  port: 2024,
  password: "postgres",
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado ao banco de dados");

    // Verifica se a tabela já existe
    const result = await client.queryArray(`
      SELECT to_regclass('public.agenda_alunos');
    `);

    if (result.rows[0][0] === null) {
      // Criar a tabela caso não exista
      await client.queryArray(`
        CREATE TABLE agenda_alunos (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          matricula VARCHAR(20) NOT NULL UNIQUE,
          cpf VARCHAR(11) NOT NULL UNIQUE,
          data_nascimento DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Tabela 'agenda_alunos' criada.");
    } else {
      console.log("Tabela 'agenda_alunos' já existe.");
    }
  } catch (err) {
    console.error("Erro ao conectar ou criar a tabela:", err);
  }
}

export { client };
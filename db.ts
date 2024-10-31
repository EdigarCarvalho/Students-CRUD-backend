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
    
    // // Drop da tabela antiga se existir
    // await client.queryArray(`DROP TABLE IF EXISTS agenda_alunos`);
    
    // Criar nova tabela
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
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

export { client };
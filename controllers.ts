import { client } from "./db.ts";
import { Aluno, validateAluno, ValidationError } from "./types.ts";

export async function getAlunos(headers: HeadersInit): Promise<Response> {
  try {
    const result = await client.queryObject<Aluno>("SELECT * FROM agenda_alunos ORDER BY id");
    return new Response(JSON.stringify(result.rows), { headers });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar alunos' }), 
      { status: 500, headers }
    );
  }
}

export async function getAlunoById(id: number, headers: HeadersInit): Promise<Response> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }), 
        { status: 400, headers }
      );
    }

    const result = await client.queryObject<Aluno>(
      "SELECT * FROM agenda_alunos WHERE id = $1", 
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aluno não encontrado" }), 
        { status: 404, headers }
      );
    }

    return new Response(JSON.stringify(result.rows[0]), { headers });
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar aluno' }), 
      { status: 500, headers }
    );
  }
}


export async function createAluno(data: unknown, headers: HeadersInit): Promise<Response> {
  try {
    const validatedAluno = validateAluno(data);

    const result = await client.queryObject<Aluno>(
      `INSERT INTO agenda_alunos (nome, email, matricula, cpf, data_nascimento) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        validatedAluno.nome,
        validatedAluno.email,
        validatedAluno.matricula,
        validatedAluno.cpf,
        validatedAluno.data_nascimento
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { 
      status: 201, 
      headers 
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    
    if (error instanceof ValidationError) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400, 
        headers 
      });
    }


    if (error.message?.includes('unique constraint')) {
      if (error.message.includes('matricula')) {
        return new Response(
          JSON.stringify({ error: 'Matrícula já cadastrada' }), 
          { status: 400, headers }
        );
      }
      if (error.message.includes('cpf')) {
        return new Response(
          JSON.stringify({ error: 'CPF já cadastrado' }), 
          { status: 400, headers }
        );
      }
    }

    return new Response(JSON.stringify({ error: 'Erro ao criar aluno' }), { 
      status: 500, 
      headers 
    });
  }
}

export async function updateAluno(id: number, data: unknown, headers: HeadersInit): Promise<Response> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      return new Response(JSON.stringify({ error: 'ID inválido' }), { 
        status: 400, 
        headers 
      });
    }

    const validatedAluno = validateAluno(data);

    const result = await client.queryObject<Aluno>(
      `UPDATE agenda_alunos 
       SET nome = $1, email = $2, matricula = $3, cpf = $4, data_nascimento = $5 
       WHERE id = $6 
       RETURNING *`,
      [
        validatedAluno.nome,
        validatedAluno.email,
        validatedAluno.matricula,
        validatedAluno.cpf,
        validatedAluno.data_nascimento,
        id
      ]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Aluno não encontrado" }), { 
        status: 404, 
        headers 
      });
    }

    return new Response(JSON.stringify(result.rows[0]), { headers });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    
    if (error instanceof ValidationError) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400, 
        headers 
      });
    }

    // Erro de violação de unique constraint
    if (error.message?.includes('unique constraint')) {
      if (error.message.includes('matricula')) {
        return new Response(
          JSON.stringify({ error: 'Matrícula já cadastrada' }), 
          { status: 400, headers }
        );
      }
      if (error.message.includes('cpf')) {
        return new Response(
          JSON.stringify({ error: 'CPF já cadastrado' }), 
          { status: 400, headers }
        );
      }
    }

    return new Response(JSON.stringify({ error: 'Erro ao atualizar aluno' }), { 
      status: 500, 
      headers 
    });
  }
}
export async function deleteAluno(id: number, headers: HeadersInit): Promise<Response> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      return new Response(
        JSON.stringify({ error: 'ID inválido' }), 
        { status: 400, headers }
      );
    }

    const result = await client.queryObject<Aluno>(
      "DELETE FROM agenda_alunos WHERE id = $1 RETURNING *", 
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Aluno não encontrado" }), 
        { status: 404, headers }
      );
    }

    return new Response(null, { status: 204, headers });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao excluir aluno' }), 
      { status: 500, headers }
    );
  }
}
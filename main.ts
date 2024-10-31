// index.ts - Arquivo principal com servidor e rotas
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { connectDB } from "./db.ts";
import { getAlunos, getAlunoById, createAluno, updateAluno, deleteAluno } from "./controllers.ts";

// Conectar ao banco
await connectDB();

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // Rotas
    if (path === "/alunos" && req.method === "GET") {
      return await getAlunos(headers);
    }
    
    if (path.match(/\/alunos\/\d+$/) && req.method === "GET") {
      const id = parseInt(path.split("/").pop()!);
      return await getAlunoById(id, headers);
    }
    
    if (path === "/alunos" && req.method === "POST") {
      const body = await req.json();
      return await createAluno(body, headers);
    }
    
    if (path.match(/\/alunos\/\d+$/) && req.method === "PUT") {
      const id = parseInt(path.split("/").pop()!);
      const body = await req.json();
      return await updateAluno(id, body, headers);
    }
    
    if (path.match(/\/alunos\/\d+$/) && req.method === "DELETE") {
      const id = parseInt(path.split("/").pop()!);
      return await deleteAluno(id, headers);
    }

    // Rota para servir o HTML
    if (path === "/" || path === "/index.html") {
      const html = await Deno.readTextFile("./index.html");
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers,
    });
  }
}

console.log("Servidor rodando em http://localhost:8000");
await serve(handler, { port: 8000 });
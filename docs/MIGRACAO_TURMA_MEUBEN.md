# Feature: Migracao de Turma para MeuBen

## 1. Objetivo
Permitir migrar uma turma local para o MeuBen com rastreabilidade, validacao forte de dados e feedback confiavel ao usuario.

## 2. Endpoints Envolvidos

### 2.1 Endpoints internos (aplicacao)
- `GET /getProjetosMigration`
  - Responsabilidade: buscar projetos disponiveis no destino.
- `POST /postProjetosMigration`
  - Responsabilidade: migrar turma e matriculas.
  - Entrada esperada:
    - `id` (id da turma origem)
    - `project` (id do projeto destino)
    - `name` (nome da turma destino)
    - `year` (ano numerico)

### 2.2 Endpoints externos (integracao MeuBen)
- `GET https://br-ipti-beneficiarios.azurewebsites.net/migration-bff/aviste?token={TOKEN}`
  - Responsabilidade: listar projetos externos.
- `POST https://br-ipti-beneficiarios.azurewebsites.net/migration-bff?token={TOKEN}`
  - Responsabilidade: receber payload final de migracao.

## 3. Fluxo Funcional (Detalhado)
1. Usuario abre dialogo de migracao.
2. Frontend chama `GET /getProjetosMigration`.
3. Backend chama endpoint externo de projetos e devolve lista.
4. Usuario seleciona projeto, informa nome da turma e ano.
5. Frontend valida campos obrigatorios e chama `POST /postProjetosMigration`.
6. Backend busca estudantes da turma pelo `id`.
7. Backend filtra apenas estudantes da turma selecionada.
8. Backend transforma dados para contrato do MeuBen.
9. Backend envia payload ao endpoint externo de migracao.
10. Backend devolve resultado para o frontend.
11. Frontend exibe sucesso ou erro e libera nova tentativa quando necessario.

## 4. Regras de Negocio Fortes

### 4.1 Regras de entrada
- `id` da turma: obrigatorio e nao vazio.
- `project`: obrigatorio e numerico.
- `name`: obrigatorio, sem apenas espacos.
- `year`: obrigatorio, numerico e plausivel (ex.: entre 1900 e ano atual + 1).

### 4.2 Regras de composicao da turma
- Migracao deve considerar apenas estudantes com vinculo direto a turma informada.
- Se turma nao tiver estudantes, definir politica explicita:
  - Opcao recomendada: bloquear migracao com erro funcional claro.

### 4.3 Regras de transformacao de estudante
- `name`: obrigatorio por estudante.
- `birthday`:
  - Origem em formato `DD/MM/YYYY`.
  - Destino obrigatorio em `YYYY-MM-DD`.
  - Data invalida deve bloquear envio.
- `cpf`:
  - Remover mascaras e caracteres nao alfanumericos.
  - Definir politica para cpf vazio/invalido (bloquear ou enviar vazio), recomendacao: bloquear com erro de validacao.
- `sex`, `color_race`, `zone`:
  - Converter para inteiro somente quando informado.
  - Se informado e nao numerico, bloquear com erro de validacao.
- `deficiency`:
  - Booleano.
  - Quando ausente, assumir `false`.

### 4.4 Regras de seguranca e integracao
- `TOKEN` de integracao nunca pode trafegar para o cliente.
- Logs nao podem expor token, cpf completo ou payload sensivel completo.
- Erros externos devem ser mapeados para erros internos compreensiveis.

### 4.5 Regras de resiliencia
- Timeout de chamada externa deve ser configurado.
- Para falhas transientes (5xx/timeout), permitir retry controlado no backend.
- Evitar duplicidade em reenvio com chave de idempotencia por turma/projeto/ano (recomendado).

## 5. Contrato de Saida (Payload para MeuBen)
```json
{
  "project": 123,
  "name": "Nome da Turma",
  "year": 2026,
  "registration": [
    {
      "name": "Nome do Estudante",
      "birthday": "2012-05-18",
      "cpf": "00000000000",
      "sex": 1,
      "color_race": 3,
      "deficiency": false,
      "zone": 2
    }
  ]
}
```

## 6. Criterios de Aceite (Objetivos)
- CA-01: Ao abrir o dialogo, lista de projetos e carregada com sucesso quando endpoint externo responder 200.
- CA-02: Sem projeto, nome ou ano, envio nao deve ocorrer e usuario deve ver mensagem de validacao.
- CA-03: Ao enviar dados validos, backend deve chamar endpoint externo de migracao exatamente 1 vez por acao do usuario.
- CA-04: Payload enviado deve conter apenas estudantes da turma solicitada.
- CA-05: `birthday` deve chegar no destino em `YYYY-MM-DD`.
- CA-06: `cpf` deve chegar sem pontuacao/mascara.
- CA-07: `deficiency` ausente na origem deve chegar como `false`.
- CA-08: Em falha externa, usuario deve receber feedback de erro e poder reenviar.
- CA-09: Token de integracao nao aparece em resposta ao cliente nem em logs funcionais.

## 7. Testes Unitarios Recomendados

### 7.1 Transformacao de dados
- `converterData`:
  - Converte `18/05/2012` para `2012-05-18`.
  - Trata entrada invalida e sinaliza erro.
- Sanitizacao de CPF:
  - `123.456.789-00` vira `12345678900`.
- Conversoes numericas:
  - `sex = "1"` vira `1`.
  - `sex = "abc"` gera erro de validacao.
- `deficiency` default:
  - `undefined` vira `false`.

### 7.2 Filtro de estudantes por turma
- Retorna somente estudantes com `classroom_fk == id`.
- Nao mistura estudantes de outras turmas.

### 7.3 Validacao de entrada do endpoint de migracao
- Rejeita requisicao sem `id`.
- Rejeita `project` nao numerico.
- Rejeita `name` vazio.
- Rejeita `year` fora da faixa valida.

### 7.4 Comportamento de integracao HTTP
- `GET projetos`:
  - Quando externo retorna 200, endpoint interno retorna dados.
  - Quando externo falha, endpoint interno retorna erro controlado.
- `POST migracao`:
  - Monta payload correto e chama URL correta.
  - Em erro externo, retorna erro interno sem vazar detalhes sensiveis.

### 7.5 Observabilidade e seguranca
- Garantir que logs de erro nao contem token.
- Garantir que logs nao exponham cpf completo.

## 8. Testes de Integracao/Contrato (Recomendados)
- Testar contrato com mock do endpoint externo validando:
  - URL chamada.
  - Metodo HTTP.
  - Estrutura e tipos do payload.
  - Mapeamento de respostas de erro.

## 9. Riscos e Pendencias Funcionais
- Confirmar tabela oficial de dominio para `sex`, `color_race` e `zone`.
- Definir politica final para estudante com dado obrigatorio invalido.
- Definir comportamento oficial para turma sem estudantes.

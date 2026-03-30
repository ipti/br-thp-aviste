# Contexto Geral do Projeto
Você é um Engenheiro de Software Sênior especialista em TypeScript, focado no ecossistema React e NestJS. Seu objetivo é escrever código limpo, modular, testável e de alta performance, seguindo os princípios SOLID e Clean Code.

## 🛠️ Stack Tecnológica
- **Linguagem Principal:** TypeScript (strict mode ativado em todo o projeto).
- **Frontend:** React 18 (Vite), css e scss, Zustand (estado global), React Query (data fetching), React Router.
- **Backend:** NestJS, Prisma ORM, Mysql .
- **Testes:** Jest para backend, Vitest + Testing Library para frontend.

---

## Regras para o Frontend (React)

### 1. Arquitetura e Componentes
- Escreva apenas **Functional Components** usando Arrow Functions. NUNCA use Class Components.
 - Siga a estrutura de pastas baseada em `Páginas`: cada página terá seu próprio estado e uma pasta com os componentes da página. Além disso, cada página deve conter (ou referenciar) pastas para `utils`, `hooks` e `api` — as chamadas de API devem incluir interfaces/DTOs. Exemplo de paths: `src/pages/[nome-da-pagina]/components`, `src/pages/[nome-da-pagina]/state`, `src/pages/[nome-da-pagina]/utils`, `src/pages/[nome-da-pagina]/hooks`, `src/pages/[nome-da-pagina]/api`.
 - Observação sobre recursos compartilhados vs específicos: quando componentes, utilitários ou hooks forem gerais e reutilizáveis entre páginas, coloque-os fora da pasta da página em pastas globais/compartilhadas (por exemplo `src/components/ui`, `src/hooks`, `src/utils`). Se um componente/util/hook for específico a uma única página ou feature, mantenha-o dentro da respectiva pasta de página (`src/pages/[nome-da-pagina]/...`) para manter coesão e facilitar refatorações.

### 2. Estilização
- Use padrão de **CSS** ou **SCSS** para estilização do projeto. Há preferência por **SCSS** quando for necessário trabalhar com variáveis, mixins e organização de temas, mas ambos são aceitos. Organize os estilos junto aos componentes (por exemplo `ComponentName/styles.scss`) ou em arquivos globais quando necessário.
- O design system primário será o **PrimeReact**. Para evitar dependência direta do design system ao longo do app, NUNCA importe componentes do PrimeReact diretamente em múltiplos locais da aplicação; sempre crie uma camada de adaptação (wrapper) dentro de `src/components/ui` que importe, normalize e exponha os componentes estilizados.
	- Exemplo: `src/components/ui/Button/index.tsx` importa internamente o `PrimeButton` e converte as props/estilos para a API do projeto.
- A pasta `src/components/ui` deve ser a única dependência do design system. Assim, trocar o design system no futuro exigirá apenas alterar/substituir essa pasta, e não o restante do código da aplicação.
- Sempre crie componentes de UI reutilizáveis (Botões, Inputs, Modais, Layouts) com Props bem definidas e tipadas em TypeScript. Estes componentes devem encapsular estilos (CSS/SCSS) e evitar lógica de negócio.

### 3. Gerenciamento de Estado e Dados
- Use **React Query** para qualquer comunicação com o backend (fetching, caching, mutações).
- Use **Zustand** apenas para estados globais do cliente (ex: tema, usuário logado, sidebar aberta). Caso a pagina demande um estado mais complexo, considere dividir o estado em slices menores e usar middlewares do Zustand para persistência ou logging.
- NUNCA use Redux ou Context API para data-fetching.

### 4. Nomenclatura (Frontend)
- Componentes e Arquivos de UI: `PascalCase` (ex: `UserProfile.tsx`).
- Hooks customizados: `camelCase` começando com 'use' (ex: `useUserData.ts`).
- Funções utilitárias e constantes: `camelCase` ou `UPPER_SNAKE_CASE` (ex: `formatDate.ts`, `MAX_RETRIES`).

---

## Regras para o Backend (NestJS)

### 1. Arquitetura
- Siga estritamente o padrão de injeção de dependências do NestJS: **Controllers** (apenas rotas e HTTP) -> **Services** (lógica de negócio) -> **Repositories/Prisma** (banco de dados).
- O Controller nunca deve conter regras de negócio, apenas orquestrar a requisição e resposta.
- Cada módulo deve ser altamente coeso. Agrupe por domínio/entidade (ex: `UsersModule`, `OrdersModule`).
- Se existirem regras de negócio que se aplicam a múltiplos módulos, considere criar um módulo de "Shared" ou "Common" para abrigar serviços/utilitários genéricos (ex: `EmailService`, `AuthService`).
- Se uma logica de negocio tiver conexao com mais de uma tabela do banco, considere criar um serviço específico para essa regra de negócio, ao invés de colocar a lógica em um único Service relacionado a uma tabela específica. Isso ajuda a manter os Services focados e evita acoplamento excessivo.

### 2. Validação e DTOs
- Sempre valide os dados de entrada usando **class-validator** e **class-transformer**.
- Todo endpoint de POST/PUT/PATCH deve ter um DTO de entrada tipado (ex: `CreateUserDto`).
- Nunca retorne entidades cruas do banco de dados (ex: com senhas ou dados sensíveis). Use DTOs de resposta ou Serializers de interceptação do NestJS.
- Ter documentação swagger para os endpoints é obrigatório. Use os decorators do NestJS para gerar a documentação automaticamente (ex: `@ApiProperty`, `@ApiResponse`).

### 3. Banco de Dados e Prisma
- Use os métodos do Prisma Client nos Services.
- Para consultas complexas ou transações, utilize a funcionalidade `$transaction` do Prisma para garantir integridade.
- Nunca crie queries SQL em texto puro, a menos que o Prisma não suporte a operação (cenários de altíssima performance).

### 4. Tratamento de Erros
- Nunca use `try/catch` vazios ou `console.log` para lidar com erros.
- Lance exceções HTTP nativas do NestJS (ex: `BadRequestException`, `NotFoundException`).
- Crie **Global Exception Filters** se precisar padronizar o payload de erro para o frontend.

---

## Regras Gerais de Código e Commits
- **Respostas da IA:** Sempre forneça o código completo sem omitir partes importantes (não use `// ... resto do código`). Explique brevemente o "porquê" da sua solução.
- **Tipagem:** NÃO use `any`. Use `unknown` se estritamente necessário e aplique Type Guards.
- **Comentários:** Comente apenas o "porquê" de lógicas complexas. O código deve ser descritivo o suficiente para explicar "o quê" está fazendo. Utilize JSDoc para documentar funções públicas nos Services do NestJS.
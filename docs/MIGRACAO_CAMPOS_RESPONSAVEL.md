# Atualização do Contrato: Campos do Responsável e Contato

**Data:** 2026-06-30
**Versão:** 2.0 (adição de campos)
**Contexto:** Novos campos adicionados à tabela `student_data` para cadastro do responsável legal e dados de contato.

---

## 1. Resumo da Mudança

A tabela `student_data` recebeu 7 novos campos. Esses campos devem ser incluídos no array `registration` do payload enviado ao endpoint:

```
POST https://br-thp-meuben.azurewebsites.net/migration-bff?token={TOKEN}
```

---

## 2. Regra de Negócio (Obrigatoriedade por Idade)

A obrigatoriedade dos campos varia conforme a maioridade do aluno, calculada a partir do campo `birthday`.

| Condição | Campos obrigatórios | Campos opcionais |
|---|---|---|
| **Menor de 18 anos** | `responsable_name`, `responsable_cpf`, `responsable_telephone`, `responsable_email` | `telephone`, `is_legal_responsible`, `image_sharing_not_authorized` |
| **18 anos ou mais** | `telephone` | `responsable_name`, `responsable_cpf`, `responsable_telephone`, `responsable_email`, `is_legal_responsible`, `image_sharing_not_authorized` |

> Campos não preenchidos são enviados como `null`.

---

## 3. Novos Campos

### 3.1 `telephone`
| Propriedade | Valor |
|---|---|
| Tipo | `string \| null` |
| Formato enviado | Apenas dígitos (sem espaços, parênteses ou traços) |
| Tamanho | 10 ou 11 dígitos |
| Obrigatório para maior | Sim |
| Obrigatório para menor | Não |

**Transformação:** `(81) 99887-7665` → `81998877665`

**Exemplo:**
```json
"telephone": "81998877665"
```

---

### 3.2 `responsable_name`
| Propriedade | Valor |
|---|---|
| Tipo | `string \| null` |
| Tamanho máximo | 200 caracteres |
| Obrigatório para menor | Sim |
| Obrigatório para maior | Não |

**Exemplo:**
```json
"responsable_name": "Maria da Silva"
```

---

### 3.3 `responsable_cpf`
| Propriedade | Valor |
|---|---|
| Tipo | `string \| null` |
| Formato enviado | Apenas dígitos (sem pontuação) — mesma transformação do campo `cpf` |
| Tamanho | 11 dígitos |
| Obrigatório para menor | Sim |
| Obrigatório para maior | Não |

**Transformação:** `123.456.789-00` → `12345678900`

**Exemplo:**
```json
"responsable_cpf": "12345678900"
```

---

### 3.4 `responsable_telephone`
| Propriedade | Valor |
|---|---|
| Tipo | `string \| null` |
| Formato enviado | Apenas dígitos (sem espaços, parênteses ou traços) |
| Tamanho | 10 ou 11 dígitos |
| Obrigatório para menor | Sim |
| Obrigatório para maior | Não |

**Transformação:** `(81) 98765-4321` → `81987654321`

**Exemplo:**
```json
"responsable_telephone": "81987654321"
```

---

### 3.5 `responsable_email`
| Propriedade | Valor |
|---|---|
| Tipo | `string \| null` |
| Tamanho máximo | 200 caracteres |
| Obrigatório para menor | Sim |
| Obrigatório para maior | Não |

**Exemplo:**
```json
"responsable_email": "maria.silva@email.com"
```

---

### 3.6 `is_legal_responsible`
| Propriedade | Valor |
|---|---|
| Tipo | `boolean` |
| Valor padrão | `false` |
| Descrição | Indica se o responsável cadastrado é o responsável legal do aluno |

**Exemplo:**
```json
"is_legal_responsible": true
```

---

### 3.7 `image_sharing_not_authorized`
| Propriedade | Valor |
|---|---|
| Tipo | `boolean` |
| Valor padrão | `false` |
| Descrição | `true` = compartilhamento de imagem do aluno **não** autorizado; `false` = autorizado |

**Exemplo:**
```json
"image_sharing_not_authorized": false
```

---

## 4. Contrato Atualizado Completo

### Payload enviado ao `POST /migration-bff`

```json
{
  "project": 123,
  "name": "Turma A - 2026",
  "year": 2026,
  "registration": [
    {
      "name": "João da Silva",
      "birthday": "2015-08-20",
      "cpf": "00000000000",
      "sex": 0,
      "color_race": 0,
      "deficiency": false,
      "zone": 0,
      "telephone": null,
      "responsable_name": "Maria da Silva",
      "responsable_cpf": "12345678900",
      "responsable_telephone": "81987654321",
      "responsable_email": "maria.silva@email.com",
      "is_legal_responsible": true,
      "image_sharing_not_authorized": false
    },
    {
      "name": "Ana Souza",
      "birthday": "2000-03-15",
      "cpf": "98765432100",
      "sex": 1,
      "color_race": 2,
      "deficiency": false,
      "zone": 0,
      "telephone": "81998877665",
      "responsable_name": null,
      "responsable_cpf": null,
      "responsable_telephone": null,
      "responsable_email": null,
      "is_legal_responsible": false,
      "image_sharing_not_authorized": false
    }
  ]
}
```

> O primeiro aluno é **menor de 18 anos** — dados do responsável preenchidos, `telephone` nulo.
> O segundo aluno é **maior de 18 anos** — apenas `telephone` preenchido, responsável nulo.

---

## 5. Diferença em Relação ao Contrato Anterior

### Contrato v1 (campos existentes — sem alteração)

```json
{
  "name": "string",
  "birthday": "YYYY-MM-DD",
  "cpf": "string (somente dígitos)",
  "sex": "integer",
  "color_race": "integer",
  "deficiency": "boolean",
  "zone": "integer"
}
```

### Delta: campos adicionados na v2

```json
{
  "telephone": "string | null",
  "responsable_name": "string | null",
  "responsable_cpf": "string | null (somente dígitos)",
  "responsable_telephone": "string | null",
  "responsable_email": "string | null",
  "is_legal_responsible": "boolean",
  "image_sharing_not_authorized": "boolean"
}
```

---

## 6. Regras de Transformação Aplicadas no Envio

| Campo | Transformação |
|---|---|
| `telephone` | Remove espaços e caracteres especiais — apenas dígitos — ou `null` |
| `responsable_name` | Trim — enviado como está ou `null` |
| `responsable_cpf` | Remove pontuação/máscara — apenas dígitos — ou `null` |
| `responsable_telephone` | Remove espaços e caracteres especiais — apenas dígitos — ou `null` |
| `responsable_email` | Enviado como está ou `null` |
| `is_legal_responsible` | Booleano — `false` quando ausente |
| `image_sharing_not_authorized` | Booleano — `false` quando ausente |

---

## 7. Critérios de Aceite para o migration-bff

- **CA-01:** O endpoint deve aceitar os 7 novos campos em cada item de `registration`.
- **CA-02:** Campos `null` devem ser aceitos sem erro (campos opcionais por design).
- **CA-03:** `is_legal_responsible` e `image_sharing_not_authorized` ausentes devem ser tratados como `false`.
- **CA-04:** `responsable_cpf` chega sem formatação (somente dígitos), igual ao campo `cpf` já existente.
- **CA-05:** O contrato v1 (campos anteriores) permanece inalterado — compatibilidade retroativa garantida.

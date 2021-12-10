# ControleEventos-node16

Uma sociedade científica deseja um sistema de informação Web para gerenciar eventos e asubmissão e avaliação de artigos científicos.

---

## Requisitos Funcionais

RF01 – Eu, enquanto membro da sociedade, desejo cadastrar-me.
Pré: -
Pós: Cadastro de membro da sociedade salvo no banco de dados.

RF02 – Eu, enquanto funcionário da sociedade, desejo cadastrar evento.
Pré: O funcionário deve estar autenticado no sistema.
Pós: Evento salvo no banco de dados.

RF03 – Eu, enquanto coordenador de evento, desejo definir comitê de programa do evento.
Pré: O coordenador de evento deve estar autenticado no sistema; o evento deve estar cadastrado.
Pós: Comitê de programa do evento salvo no banco de dados.

RF04 – Eu, enquanto membro da sociedade, desejo submeter artigo.
Pré: O membro da sociedade deve estar autenticado no sistema; o evento deve estar cadastrado.
Pós: O artigo salvo no banco de dados.

RF05 – Eu, enquanto coordenador de evento, desejo designar membros do comitê de programa do evento para avaliar artigo.
Pré: O comitê de programa do evento deve estar definido; o coordenador de evento deve estar autenticado no sistema; o artigo deve estar submetido.
Pós: Designação de avaliadores salva no banco de dados.

### Fluxo básico:

01 – sistema exibirá formulário de designação de avaliadores;

02 – coordenador assinala o primeiro avaliador;

03 – sistema exibe campo para o segundo avaliador;

04 – coordenador assinala o segundo avaliador;

05 - sistema exibe campo para o terceiro avaliador;

06 - coordenador assinala o terceiro avaliador;

07 – sistema exibe mensagem se deseja mais avaliadores;

08 – coordenador pressiona “Não”;

09 – sistema exibe mensagem de confirmação;

### Fluxos alternativos:

FA01 – o coordenador deseja inserir mais avaliadores (pressiona “Sim”):

FA01.1 – o sistema exibe campo para novo avaliador;

FA01.2 – o coordenador assinala o novo avaliador;

FA01.3 – retorna ao passo 07 do fluxo básico;

### Fluxos de exceção:

FE01 – o coordenador seleciona autor do artigo ou membro do comitê de programa do evento vinculado a uma das instituições dos autores para ser avaliador:

FE01.1 – o sistema exibe mensagem informando o erro;

FE01.2 – retorna para o passo anterior ao erro;

RF06 – Eu, enquanto avaliador, desejo avaliar artigo.
Pré: O avaliador deve estar autenticado no sistema; o avaliador deve estar designado para avaliar o artigo.
Pós: Notas salvas no banco de dados.

## Requisitos Não-Funcionais

RNF01 – o sistema deve ser web;

## Regras de Negócio

RN01 – para o cadastro do membro da sociedade, são obrigatórios: nome, sexo, endereço, telefones, e-mail e instituições (nome, cidade e país) a quais está vinculado; (RF01)

RN02 – para o cadastro do evento, são obrigatórios: nome, coordenador, data limite para submissão de artigos, datas de início e fim do evento, estado da federação onde o evento ocorrerá e temas de interesse; (RF02)

RN03 – para submissão de artigo, são obrigatórios: título, autores, temas de interesse do evento (pelo menos um); (RF04)

RN04 - autores do artigo ou um membros do comitê de programa vinculados a uma instituição de um dos autores do artigo não pode ser designado para avaliar este artigo; (RF05)

RN05 - cada artigo deve ter, pelo menos, três avaliadores designados para avaliá-lo; (RF05)

RN06 – todo coordenador, membro de programa de evento e autor deve estar cadastrado no sistema; (RF02, RF03, RF04, RF05, RF06)

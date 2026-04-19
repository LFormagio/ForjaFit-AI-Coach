# 🦾 ForjaFit AI Coach

![Status](https://img.shields.io/badge/Status-100%25_Pronto_para_Lançamento-success)
![Versão](https://img.shields.io/badge/Versão-MVP_1.0.0-blue)
![Stack Tecnológica](https://img.shields.io/badge/Stack-Node.js%20|%20TypeScript%20|%20PostgreSQL-3178C6)
![LLM Integração](https://img.shields.io/badge/LLM-OpenAI_GPT--4o--mini-black)

## 📌 Visão do Produto
O ForjaFit não é um aplicativo com interface visual nativa onde o aluno preenche longos formulários ou clica em abas. Ele é um **Personal Trainer IA** focado exclusivamente na vertical de treino de condicionamento físico (**Fitness**) interagindo única e exclusivamente pelo WhatsApp. 

O valor bruto da operação reside em: **Cobrança Ativa (Accountability), Proximidade e Organização** com o menor nível de fricção técnica para o aluno base.

---

## ⚡ Features 100% Funcionais do MVP

### 1. 🎛️ Personalidade Customizada pelos Usuários
Durante o *Onboarding*, o aluno define como ele necessita que seja o modelo de sua cobrança:
- 🫂 **O Amigão Torcedor:** Reforça positivamente falhas, preza bem-estar emocional, muito uso de Emojis.
- 🪖 **O Sargento Inflexível:** Respostas secas, militares. Foco cirúrgico na disciplina sem desculpas.
- 🦉 **O Mentor Prático:** Age como professor. Transparente, direto e que apresenta fatos e métodos práticos para voltar na linha.

### 2. 🛡️ Motor Híbrido: Blindando Alucinações da IA
- **State Machine Engine:** Trava automática antes do LLM. Se o aluno manda dados incorretos, faltantes (esquecer número de dias, ou esquecer o objetivo), um robô travado impede o LLM de processar dados soltos pedindo para que o cliente refine a resposta com foco.
- **Rules Determinístico:** O motor que dita se o aluno vai correr as 5 horas da manhã ou não, não é a IA. É o gerador determinístico do projeto (TypeScript Types e Array). A inteligência artificial só trabalha o "embelezamento/tom de voz" do JSON gerado, zerando chances de prescrição médica perigosa.

### 3. ⏳ Debounce e Aglutinação de Mensagens
Evita a confusão gerada por mensagens picadas ("Oi", "Como Vai", "quero"). 
O sistema capta em Buffers, zera as intermitências de envios por 4 segundos, aglutinando as três e mandando ao LLM uma coesão: "Oi Como Vai quero", economizando tokens da OpenAI e gerando resposta correta.

---

## 🛠️ Arquitetura e Stack
O produto é fundamentado no `Node.js / TypeScript` com modelo Backend Modular (MVC):

- **Integração WhatsApp:** Biblioteca Ponto-a-Ponto `@whiskeysockets/baileys`. Rodou, scanneou o QR Code no seu terminal, e o número de testes na sua mão já assume o Posto do Bot, isento de integrações pesadas de provedores oficiais em fase Beta.
- **Banco de Dados Relacional:** PostgreSQL rodando pelas orquestrações do `Prisma ORM` (Models construídas do *Lead Type*, *Conversões*, e status de *FitnessContext*).
- **Tradução Cognitiva LLM:** SDK Oficial da OpenAI acoplada no backend mapeando a máquina de estados.

---

## 🚀 Como Iniciar e Rodar a Aplicação

Este MVP já tem toda a dependência configurada num arquivo `package.json` limpo.
Requisitos mínimos para seu PC Server Cloud (Virtual Machine):
- Instalar Node.JS (versão Recomendada LT. v20+)
- PostgreSQL Instalado ou Rodando Docker (`docker run -p 5432:5432 postgres`)

**Passo a passo no terminal:**
```bash
# 1. Instalar Módulos Node
npm install

# 2. Criar e preencher Variáveis de Ambiente no arquivo '.env' baseando no schema final
echo "DATABASE_URL=postgresql://usuario:senha@localhost:5432/forjafit" >> .env
echo "OPENAI_API_KEY=sk-SuaChaveOpenAI" >> .env

# 3. Empurrar os bancos do Prisma pro BD local
npx prisma db push

# 4. Rodar o Projeto
npm start
```
Após o NPM bater a inicialização do Bailey, leia o *QR Code* apontando com o Celular no Status de vincular dispositivo da plataforma. 

*(Dica: Se estiver realizando os testes UI do WebFlow, rode direto o arquivo index `chat-simulator.html` em seu Navegador sem a necessidade de instâncias NPM).*

---

## 📈 Roadmap (Amadurecimento - v2.0)
Após a coleta dos primeiros assinantes (com trial e gatilhos orgânicos convertendo em assinatura manual entre 5 e 7 dias de Onboarding):

- Migrar a Engine Baileys WhatsApp para a via **Plataforma Meta Cloud Oficial API** para evitar quedas e obter os *Green Ticks*.
- Evoluir funil inicial (Numérico Simples) para o modelo **Misto Onboarding Livre Conversacional** (Bate papo full flow).

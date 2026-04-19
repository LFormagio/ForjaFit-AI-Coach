# Product Requirements Document (PRD) - ForjaFit AI Coach MVP

## 1. Visão Geral
O ForjaFit não é um aplicativo com interface visual estática, mas sim um AI Personal Coach que vive no WhatsApp. O produto para o usuário é conversa, clareza administrativa no envio de treinos, cobrança, motivação ativa e adaptação contínua. 
Nosso escopo de MVP aborda estritamente **fitness** (treino, rotina, accountability).

## 2. Decisões de Arquitetura e Brainstorming
Conforme as definições levantadas na nossa etapa de concepção da ideia:

*   **Canal de Comunicação (WhatsApp):** Para o MVP, focar na velocidade e menor atrito. Foi pré-definido validar a distribuição de mensagens e check-ins com integrações ágeis baseadas na web (API não oficial como Evolution API ou Baileys), garantindo disparo proativo que o plano requer sem os atritos de aprovação de templates da Meta em um primeiro momento.
*   **Tom e Personalidade do AI (A Grande Sacada):** O usuário será quem definirá qual o melhor perfil de cobrança para si. Durante o Onboarding conversacional de triagem física, a IA perguntará "Que tipo de coach funciona melhor para a sua constância?". O sistema salvará isso em perfis no Banco de Dados:
    1.  *O Amigão Torcedor:* Foco em positividade, emojis, energia alta, celebra micro-vitórias e acolhe bem os dias de cansaço.
    2.  *O Sargento:* Inflexível, militarizado, cobra disciplina e tolerância zero a desculpas.
    3.  *O Mentor Adaptativo:* Pragmático, calmo, questiona as causas e adapta o treino (ex: "Não dormiu bem? Vamos fazer 20 mins básicos em vez do treino pesado, mas não pule.").

## 3. Arquitetura Técnica
1.  **Back-end:** TS/Node.js com serviços internos para receber webhooks do WhatsApp e disparar rotinas (cron jobs) de lembretes e cobrança diária.
2.  **Motor Determinístico (Core de Segurança):** O gerador do que deve ser treinado, tempos de descanso e divisões de semana *NÃO É a inteligência artificial*. Seguirá logs e lógicas determinísticas desenvolvidas em código interno para garantir previsibilidade e evitar prescrições perigosas pelas 'alucinações' tradicionais de um LLM puro.
3.  **Camada de Conexão Cognitiva (LLM):** Pega os dados técnicos processados e formula texto humano para conversar, atuando estritamente como intérprete e elo motivacional do motor técnico, já possuindo inserido pelo sistema qual a tonalidade escolhida pelo usuário.
4.  **Armazenamento de Estado (PostgreSQL):** Guardará todo o esquema, controle de janelas, estado da conversão e flag do momento em que o usuário se encontra na jornada (Lead, Trial, Assinante).

## 4. User Journey Canônica
1.  **Aquisição:** Escaneia o QR Code/Link do WhatsApp.
2.  **Onboarding (Estratégia Mista):** No MVP (v1), o fluxo de perguntas da triagem técnica e seleção do tom de voz do coach será um Fluxo Estruturado/Numérico via bot simples (ex: escolha 1 a 3). Na fase de amadurecimento (v2), migrará para Onboarding Livre Conversacional.
3.  **Entrega do Plano:** Geração do planejamento para a semana via motor rígido + aprovação simulada do Coach em texto ("Bora pra guerra, recruta", ou "Vamos construir essa escada um dia de cada vez!").
4.  **Rotina de Checkout:** Lembrete pré-treino diário, follow-up ("foi bem hoje?", e no dia de falta, puxão de orelha de acordo com sua tonalidade).
5.  **Conversão:** Oferta automatizada de assinatura rotineira (R$ 79/mês), dentro da própria janela do chatbot via link Pix/Cartão entre o 5º e o 7º dia do acompanhamento.

## 5. Critérios de Sucesso e Escalabilidade Futura
*   Lançar o MVP com um funil de entrada em formato conciso, visando as 4 sessões em 14 dias sem cancelamento agressivo.
*   Somente migrar para provedores de alta confiabilidade corporativa na Meta Cloud se a conversão *Trial -> Pagante* chegar em estabilidade em pequena/média escala.

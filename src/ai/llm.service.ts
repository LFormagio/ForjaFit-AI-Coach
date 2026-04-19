import OpenAI from "openai";

/**
 * llm.service.ts
 *
 * Reponsável por envelopar o Prompt e o JSON do treinador.
 * O LLM age como um tradutor comportamental.
 */

// Como o MVP não usará lib se as keys não estiverem definidas, deixamos flexível.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "YOUR_KEY_HERE"
});

export class LLMService {
  
  static async translateWorkoutPlan(tone: string, workoutJson: string): Promise<string> {
    const prompt = this.buildPrompt(tone);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `Gere a resposta para o aluno baseada neste treino técnico gerado pela central: ${workoutJson}` }
        ],
        model: "gpt-4o-mini",
      });

      return completion.choices[0].message.content || "Seu treino está pronto!";
    } catch (e) {
      console.error("LLM API error:", e);
      return "Ocorreu um erro ao formatar sua mensagem. Mas o treino está arquivado com segurança.";
    }
  }

  static async generateCheckinMessage(tone: string): Promise<string> {
      const prompt = this.buildPrompt(tone);
      // Simulação rápida para o Cron Job
      return `[Mensagem gerada pelo Tom de voz: ${tone}] E aí, cumpriu o treino hoje?`;
  }

  private static buildPrompt(tone: string) {
    switch (tone) {
      case "SARGENTO":
        return `Você é um AI Coach estilo Sargento disciplinador. Sua função é entregar o treino técnico recebido em JSON em formato de texto firme e intolerante com a preguiça. Seja curto, grosso e focado na disciplina.`;
      case "AMIGAO":
        return `Você é um AI Coach super animado e empático. Sua função é entregar o treino e motivar muito o aluno. Use emojis e celebre a constância.`;
      case "MENTOR":
      default:
        return `Você é um Mentor prático. Foque na organização, na clareza didática. Entregue o treino técnico explicando o motivo breve de cada exercício, sem excesso de enrolação.`;
    }
  }

}

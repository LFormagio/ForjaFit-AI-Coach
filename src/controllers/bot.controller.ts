import prisma from '../config/database';
import { WorkoutGenerator } from '../engine/workout.generator';
import { LLMService } from '../ai/llm.service';

/**
 * Controller principal do Bot - Atua como State Machine
 */
export class BotController {

  static async handleMessage(jid: string, text: string): Promise<string | null> {
    // 1. Busca se o usuário existe
    const phone = jid.split('@')[0];
    let user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

    // 2. State: Lead (Novo Usuário)
    if (!user) {
      user = await prisma.user.create({ data: { phoneNumber: phone, status: 'ONBOARDING_TONE' } });
      return "Olá! Eu sou o ForjaFit, seu AI Coach de Treino! 💪\nPara começarmos, qual perfil de treinador funciona melhor para você?\n\n1️⃣ O Amigão: Me motive com emojis e pegue leve quando eu estiver cansado.\n2️⃣ O Sargento: Zero desculpas. Tolerância zero e foco total.\n3️⃣ O Mentor: Prático, racional, apenas foque na constância.\n\n(Responda com 1, 2 ou 3)";
    }

    // 3. State: Onboarding de Tomização
    if (user.status === 'ONBOARDING_TONE') {
      const option = text.trim();
      let tone = "MENTOR";
      if (option === '1') tone = "AMIGAO";
      if (option === '2') tone = "SARGENTO";

      await prisma.user.update({
        where: { id: user.id },
        data: { toneOfVoice: tone, status: 'ONBOARDING_PHYSICAL' }
      });
      
      return "Excelente! Agora me diga, numa resposta só de texto longo: \nQual seu objetivo? (Hipertrofia, emagrecer)\nComo é sua experiência?\nQuantos dias pode treinar? Tem alguma dor?";
    }

    // 4. State: Coleta do JSON estruturado via LLM ou Numérico (MVP)
    if (user.status === 'ONBOARDING_PHYSICAL') {
      // Aqui no MVP faríamos a triagem de regex, mas vamos gerar um mock para demonstrar:
      const generatedPlanJson = WorkoutGenerator.generateWeeklyPlan({
        objective: "HIPERTROFIA",
        experience: "INICIANTE",
        daysPerWeek: 3,
        limitations: /dor/.test(text.toLowerCase()) ? "joelho e lombar" : "nenhuma"
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'TRIAL' }
      });

      // Passa pro LLM traduzir essa ficha usando a personalidade
      return await LLMService.translateWorkoutPlan(user.toneOfVoice || "MENTOR", generatedPlanJson);
    }

    // 5. State: Trial ou Ativo (Conversa Normal)
    if (user.status === 'TRIAL' || user.status === 'ACTIVE') {
      // Todo suporte em tempo real passa pro LLM:
      const fakeContextTreino = 'TREINO DA SEMANA: FULL BODY';
      return await LLMService.translateWorkoutPlan(user.toneOfVoice || "MENTOR", `Aluno perguntou: ${text}. Contexto atual: ${fakeContextTreino}`);
    }

    return "Não entendi sua mensagem. Digite 'Menu' para opções.";
  }
}

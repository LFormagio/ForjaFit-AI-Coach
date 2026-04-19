/**
 * workout.generator.ts
 *
 * Motor Determinístico do ForjaFit MVP.
 * O objetivo é transformar as respostas do usuário em uma estrutura de treino rígida JSON.
 * SEM uso de LLM nessa etapa para evitar "alucinações" que prescrevam coisas perigosas.
 */

interface FitnessInput {
  objective: string;
  experience: string;
  daysPerWeek: number;
  limitations?: string | null;
}

export class WorkoutGenerator {
  
  static generateWeeklyPlan(input: FitnessInput) {
    const hasBackPain = input.limitations?.toLowerCase().includes("lombar") || 
                        input.limitations?.toLowerCase().includes("costas");
                        
    const hasKneePain = input.limitations?.toLowerCase().includes("joelho");

    const splitType = this.determineSplit(input.daysPerWeek);
    
    // Regra rígida e hardcoded para MVP:
    // Se for 3 dias no MVP, passar um split Full-body.
    const plan = {
      split: splitType,
      exercises: this.getExercisesForSplit(splitType, hasBackPain, hasKneePain)
    };

    return JSON.stringify(plan);
  }

  private static determineSplit(days: number) {
    if (days <= 3) return "FULL_BODY";
    if (days === 4) return "UPPER_LOWER";
    return "PPL"; // Push, Pull, Legs
  }

  private static getExercisesForSplit(split: string, hasBackPain: boolean | undefined, hasKneePain: boolean | undefined) {
    // Array rígido
    let exercises: any[] = [];
    
    if (split === "FULL_BODY") {
      exercises = [
        { name: "Flexão de Braços", sets: 3, reps: "10-12" },
        { name: hasBackPain ? "Remada Máquina" : "Remada Curvada", sets: 3, reps: "10-12" },
        { name: hasKneePain ? "Cadeira Extensora Leve" : "Agachamento Livre", sets: 3, reps: "10-15" }
      ];
    } else {
        // ... Logica expansível
        exercises = [ { name: "Treino Dinâmico", sets: 3, reps: 10 } ];
    }
    
    return exercises;
  }
}

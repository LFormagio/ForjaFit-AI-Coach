import 'dotenv/config';
import { WhatsAppService } from './services/whatsapp.service';

async function bootstrap() {
  console.log("Iniciando ForjaFit AI Coach...");
  const waService = new WhatsAppService();
  await waService.connect();
}

bootstrap().catch(err => {
  console.error("Erro fatal ao iniciar:", err);
});

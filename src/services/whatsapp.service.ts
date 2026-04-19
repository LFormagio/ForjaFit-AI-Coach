import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { BotController } from '../controllers/bot.controller';

export class WhatsAppService {
  private sock: any;
  private messageBuffer: Map<string, { timer: ReturnType<typeof setTimeout>, texts: string[] }> = new Map();

  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    });

    this.sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
        if (shouldReconnect) {
          this.connect();
        }
      } else if (connection === 'open') {
        console.log('✅ WhatsApp Connectado!');
      }
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('messages.upsert', async (m: any) => {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const remoteJid = msg.key.remoteJid;
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

      if (!remoteJid || !text) return;

      console.log(`Mensagem recebida de ${remoteJid}: ${text}`);

      // Acumula múltiplas mensagens picadas (Debounce de 4 segundos)
      if (this.messageBuffer.has(remoteJid)) {
        clearTimeout(this.messageBuffer.get(remoteJid)!.timer);
        this.messageBuffer.get(remoteJid)!.texts.push(text);
      } else {
        this.messageBuffer.set(remoteJid, { timer: setTimeout(() => {}, 0), texts: [text] });
      }

      const timer = setTimeout(async () => {
        const aglutinatedMessage = this.messageBuffer.get(remoteJid)!.texts.join(" ");
        this.messageBuffer.delete(remoteJid);
        
        console.log(`BATERIA DE MENSAGENS PROCESSADA DE ${remoteJid}: ${aglutinatedMessage}`);
        
        // Manda o texto inteiro e consolidado pro controlador da State Machine e IA
        const response = await BotController.handleMessage(remoteJid, aglutinatedMessage);
        if (response) await this.sendMessage(remoteJid, response);
      }, 4000); // Espera 4 segs de silêncio após a última mensagem dita antes de responder

      this.messageBuffer.get(remoteJid)!.timer = timer;
    });
  }

  async sendMessage(to: string, text: string) {
    if (!this.sock) return;
    await this.sock.sendMessage(to, { text });
  }
}

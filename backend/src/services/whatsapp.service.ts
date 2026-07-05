import { env } from '../config/env.config';
import { logger } from '../utils/logger';

export class WhatsAppService {
    private static apiUrl = env.WHATSAPP_API_URL;
    private static apiToken = env.WHATSAPP_API_TOKEN;
    private static isEnabled = env.WHATSAPP_SENDER_ENABLED;

    /**
     * Dispara uma mensagem automática de confirmação de agendamento via Gateway HTTP POST.
     */
    public static async sendConfirmation(
        clientPhone: string,
        clientName: string,
        service: string,
        price: number,
        dateFormatted: string,
        time: string,
        barber: string
    ): Promise<boolean> {
        const textMessage = `💈 *ROCHA 20 - AGENDAMENTO CONFIRMADO* 💈\n\n` +
            `Olá, *${clientName}*! Seu horário foi reservado com sucesso:\n\n` +
            `✂️ *Serviço:* ${service} (R$ ${price.toFixed(2).replace('.', ',')})\n` +
            `📅 *Data:* ${dateFormatted}\n` +
            `⏱️ *Horário:* ${time}\n` +
            `💈 *Barbeiro:* ${barber}\n\n` +
            `Aguardamos você no horário marcado! Se precisar reagendar ou cancelar, entre em contato. Obrigado!`;

        // Se o disparo estiver desabilitado (modo simulação em ambiente local/testes)
        if (!this.isEnabled) {
            logger.info(`[SIMULAÇÃO DISPARO WHATSAPP] Destinatário: ${clientPhone}`);
            logger.info(`Mensagem de Confirmação:\n${textMessage}`);
            return true;
        }

        // Validação de credenciais da API
        if (!this.apiUrl || !this.apiToken) {
            logger.error('[INTEGRAÇÃO WHATSAPP] Erro: WHATSAPP_API_URL ou WHATSAPP_API_TOKEN não definidos no .env.');
            return false;
        }

        try {
            logger.info(`[INTEGRAÇÃO WHATSAPP] Disparando confirmação HTTP POST para ${clientPhone}...`);

            // Garantir DDI internacional brasileiro (55) se o número vier incompleto
            let formattedPhone = clientPhone.replace(/\D/g, '');
            if (formattedPhone.length === 11 && !formattedPhone.startsWith('55')) {
                formattedPhone = `55${formattedPhone}`;
            }

            // Chamada HTTP POST nativa
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiToken
                },
                body: JSON.stringify({
                    phone: formattedPhone,
                    message: textMessage
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gateway returned HTTP ${response.status}: ${errorText}`);
            }

            logger.info(`[INTEGRAÇÃO WHATSAPP] Confirmação enviada com sucesso para ${clientPhone}!`);
            return true;
        } catch (error) {
            logger.error(`[INTEGRAÇÃO WHATSAPP] Falha no disparo de mensagem para ${clientPhone}:`, error);
            return false;
        }
    }
}

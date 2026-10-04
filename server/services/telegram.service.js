const sendTelegramNotification = async (inquiryData) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Telegram Service] Notification skipped (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured).');
    return false;
  }

  const message = `🔔 *New Tutoring Inquiry Received!*
━━━━━━━━━━━━━━━━━━
👤 *Name:* ${inquiryData.clientName} (${inquiryData.clientRole || 'Parent'})
🎓 *Grade:* ${inquiryData.studentGrade}
📚 *Subject:* ${inquiryData.subject}
💻 *Mode:* ${inquiryData.mode || 'Online'}
📞 *Phone/WhatsApp:* ${inquiryData.phoneOrWhatsApp}
✉️ *Email:* ${inquiryData.email || 'Not provided'}
⏰ *Preferred Schedule:* ${inquiryData.preferredSchedule || 'Flexible'}
📝 *Topic Struggles:* ${inquiryData.topicStruggles || 'General assistance'}
💬 *Message:* ${inquiryData.message || 'None'}
━━━━━━━━━━━━━━━━━━
*Status:* NEW`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();
    if (result.ok) {
      console.log('[Telegram Service] Notification successfully dispatched.');
      return true;
    } else {
      console.warn(`[Telegram Service Warning] Telegram API returned error: ${result.description}`);
      return false;
    }
  } catch (error) {
    console.error(`[Telegram Service Error] Failed to send message: ${error.message}`);
    return false;
  }
};

module.exports = { sendTelegramNotification };

type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emailJsEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';

export async function sendContactMessage(values: ContactMessage) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS is not configured yet.');
  }

  const response = await fetch(emailJsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: values.name,
        reply_to: values.email,
        subject: values.subject,
        message: values.message,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('EmailJS could not send the message.');
  }
}
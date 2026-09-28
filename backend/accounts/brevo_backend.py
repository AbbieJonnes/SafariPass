import requests
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend


class BrevoAPIEmailBackend(BaseEmailBackend):
    """Sends email through Brevo's HTTPS API (port 443), because
    Render's free tier blocks SMTP ports."""

    API_URL = "https://api.brevo.com/v3/smtp/email"

    def send_messages(self, email_messages):
        sent = 0
        for message in email_messages:
            payload = {
                "sender": {"email": settings.DEFAULT_FROM_EMAIL, "name": "SafariPass"},
                "to": [{"email": address} for address in message.to],
                "subject": message.subject,
                "textContent": message.body,
            }
            try:
                response = requests.post(
                    self.API_URL,
                    json=payload,
                    headers={
                        "api-key": settings.BREVO_API_KEY,
                        "accept": "application/json",
                    },
                    timeout=15,
                )
                response.raise_for_status()
                sent += 1
            except Exception as e:
                print(f"Brevo API email failed: {e}")
                if not self.fail_silently:
                    raise
        return sent
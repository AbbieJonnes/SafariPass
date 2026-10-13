from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from google import genai
from google.genai import types

client = genai.Client(api_key=settings.GEMINI_API_KEY)


class ChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get('message', '').strip()
        page_context = request.data.get('page_context', 'a page in the SafariPass app')

        if not message:
            return Response(
                {'error': 'Message is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        system_prompt = (
            "You are the SafariPass help assistant, embedded inside the SafariPass web app, "
            "a digital matatu subscription and QR ticketing platform for Kenyan commuters. "
            "SafariPass has four roles: Passenger (subscribes to routes, gets a QR pass, can shift "
            "routes temporarily, tracks their journey on a map), Conductor (scans passenger QR codes "
            "to validate active/expired/invalid), Company Admin (manages their company's routes, fares, "
            "plan types, and adds conductors), and Super Admin (creates companies and company admins). "
            f"The user is currently on: {page_context}. "
            "Greet the user warmly if they say hello. Answer briefly and practically, guiding them on "
            "how to use SafariPass. If asked something unrelated to SafariPass, politely redirect to "
            "what you can help with."
        )

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                ),
            )
            return Response({'reply': response.text})
        except Exception as e:
            print(f"Chatbot error: {e}")
            return Response(
                {'reply': "Sorry, I'm having trouble responding right now. Please try again shortly."},
                status=status.HTTP_200_OK,
            )
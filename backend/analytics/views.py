from django.db.models import Sum, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from payments.models import Payment, ValidationRecord
from subscriptions.models import Subscription
from companies.models import Route


class RevenueAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company_id = request.query_params.get('company')
        route_id = request.query_params.get('route')

        payments = Payment.objects.filter(status='success')
        if company_id:
            payments = payments.filter(subscription__route__company_id=company_id)
        if route_id:
            payments = payments.filter(subscription__route_id=route_id)

        total = payments.aggregate(total_revenue=Sum('amount'))['total_revenue'] or 0

        by_route = (
            payments.values('subscription__route__id', 'subscription__route__origin', 'subscription__route__destination')
            .annotate(revenue=Sum('amount'))
            .order_by('-revenue')
        )

        return Response({
            'total_revenue': total,
            'by_route': list(by_route),
        })


class ActiveSubscriptionsAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        active_qs = Subscription.objects.filter(status='active')

        total_active = active_qs.count()
        by_route = (
            active_qs.values('route__id', 'route__origin', 'route__destination')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        return Response({
            'total_active_subscriptions': total_active,
            'by_route': list(by_route),
        })


class RoutePopularityAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        popularity = (
            ValidationRecord.objects.values(
                'subscription__route__id',
                'subscription__route__origin',
                'subscription__route__destination',
            )
            .annotate(validation_count=Count('id'))
            .order_by('-validation_count')
        )
        return Response({'route_popularity': list(popularity)})


class BoardingValidationAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = ValidationRecord.objects.count()
        by_result = (
            ValidationRecord.objects.values('result')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        return Response({
            'total_validations': total,
            'by_result': list(by_result),
        })
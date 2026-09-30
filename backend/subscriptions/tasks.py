from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta

from .models import Subscription, RouteShift
from payments.models import ValidationRecord


@shared_task
def check_unused_days_rollover():
    from accounts.models import NotificationLog

    today = timezone.now().date()
    active_subs = Subscription.objects.filter(status='active', expiry_date__gte=timezone.now())

    for sub in active_subs:
        rode_today = ValidationRecord.objects.filter(
            subscription=sub,
            scanned_at__date=today,
            result='active',
        ).exists()

        if not rode_today:
            sub.expiry_date = sub.expiry_date + timedelta(days=1)
            sub.save()

            if sub.passenger.email:
                send_mail(
                    subject="Your SafariPass subscription was extended",
                    message=(
                        f"Hi {sub.passenger.username},\n\n"
                        f"You didn't board today, so your subscription has been "
                        f"extended by 1 day to make up for it. New expiry: {sub.expiry_date}.\n\n"
                        f"— SafariPass"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[sub.passenger.email],
                )
                NotificationLog.objects.create(user=sub.passenger, type='rollover_extension')


@shared_task
def revert_expired_route_shifts():
    from accounts.models import NotificationLog

    now = timezone.now()
    expired_shifts = RouteShift.objects.filter(reverted=False, ends_at__lte=now)

    for shift in expired_shifts:
        shift.reverted = True
        shift.save()

        if shift.subscription.passenger.email:
            send_mail(
                subject="Your SafariPass route shift has ended",
                message=(
                    f"Hi {shift.subscription.passenger.username},\n\n"
                    f"Your temporary shift to {shift.temporary_route} has ended. "
                    f"You're back on {shift.original_route}.\n\n"
                    f"— SafariPass"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[shift.subscription.passenger.email],
            )
            NotificationLog.objects.create(user=shift.subscription.passenger, type='shift_reverted')


@shared_task
def send_expiry_warnings():
    from accounts.models import NotificationLog

    warning_date = timezone.now() + timedelta(days=1)
    expiring_soon = Subscription.objects.filter(
        status='active',
        expiry_date__gte=timezone.now(),
        expiry_date__lte=warning_date,
    )

    for sub in expiring_soon:
        already_warned = NotificationLog.objects.filter(
            user=sub.passenger,
            type='expiry_warning',
        ).filter(sent_at__date=timezone.now().date()).exists()

        if already_warned:
            continue

        if sub.passenger.email:
            send_mail(
                subject="Your SafariPass subscription expires soon",
                message=(
                    f"Hi {sub.passenger.username},\n\n"
                    f"Your subscription on {sub.route} expires on "
                    f"{sub.expiry_date.strftime('%d %b %Y, %I:%M %p')}.\n\n"
                    f"Renew from Browse Routes to avoid any interruption.\n\n"
                    f"— SafariPass"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[sub.passenger.email],
            )
            NotificationLog.objects.create(user=sub.passenger, type='expiry_warning')
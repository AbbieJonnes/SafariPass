from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta

from .models import Subscription, RouteShift
from payments.models import ValidationRecord

MAX_ROLLOVER_DAYS = 7


def _plan_days(sub):
    if sub.plan_type and sub.plan_type.duration == 'weekly':
        return 7
    return 30


def _fmt(dt):
    return timezone.localtime(dt).strftime('%d %b %Y, %I:%M %p')


def expire_subscription(sub):
    """Mark a subscription expired and email the passenger. Safe to call twice."""
    if sub.status == 'expired':
        return

    sub.status = 'expired'
    sub.save()

    email = sub.passenger.email
    if not email:
        print(f"Subscription {sub.id} expired, but {sub.passenger.username} has no email on file.")
        return

    try:
        send_mail(
            subject="Your SafariPass subscription has expired",
            message=(
                f"Hi {sub.passenger.username},\n\n"
                f"Your subscription on {sub.route.origin} → {sub.route.destination} "
                f"expired on {_fmt(sub.expiry_date)}.\n\n"
                f"Renew from Browse Routes to keep riding:\n"
                f"{settings.FRONTEND_URL}/passenger/browse\n\n"
                f"— SafariPass"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        print(f"Expiry email sent to {email} for subscription {sub.id}")
    except Exception as e:
        print(f"Failed to send expired notice to {email}: {e}")


@shared_task
def send_expired_notices():
    now = timezone.now()
    for sub in Subscription.objects.filter(status='active', expiry_date__lt=now):
        expire_subscription(sub)


@shared_task
def check_unused_days_rollover():
    from accounts.models import NotificationLog

    today = timezone.localdate()
    active_subs = Subscription.objects.filter(status='active', expiry_date__gte=timezone.now())

    for sub in active_subs:
        latest_allowed = sub.start_date + timedelta(days=_plan_days(sub) + MAX_ROLLOVER_DAYS)
        if sub.expiry_date >= latest_allowed:
            continue

        rode_today = ValidationRecord.objects.filter(
            subscription=sub,
            scanned_at__date=today,
            result='active',
        ).exists()

        if not rode_today:
            sub.expiry_date = sub.expiry_date + timedelta(days=1)
            sub.save()

            if sub.passenger.email:
                try:
                    send_mail(
                        subject="Your SafariPass subscription was extended",
                        message=(
                            f"Hi {sub.passenger.username},\n\n"
                            f"You didn't board today, so your subscription has been "
                            f"extended by 1 day to make up for it. New expiry: {_fmt(sub.expiry_date)}.\n\n"
                            f"— SafariPass"
                        ),
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[sub.passenger.email],
                    )
                    NotificationLog.objects.create(user=sub.passenger, type='rollover_extension')
                except Exception as e:
                    print(f"Failed to send rollover email to {sub.passenger.email}: {e}")


@shared_task
def revert_expired_route_shifts():
    from accounts.models import NotificationLog

    now = timezone.now()
    expired_shifts = RouteShift.objects.filter(reverted=False, ends_at__lte=now)

    for shift in expired_shifts:
        shift.reverted = True
        shift.save()

        passenger = shift.subscription.passenger
        if passenger.email:
            try:
                send_mail(
                    subject="Your SafariPass route shift has ended",
                    message=(
                        f"Hi {passenger.username},\n\n"
                        f"Your temporary shift to {shift.temporary_route} has ended. "
                        f"You're back on {shift.original_route}.\n\n"
                        f"— SafariPass"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[passenger.email],
                )
                NotificationLog.objects.create(user=passenger, type='shift_reverted')
            except Exception as e:
                print(f"Failed to send shift-ended email to {passenger.email}: {e}")


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
            sent_at__date=timezone.localdate(),
        ).exists()

        if already_warned:
            continue

        if sub.passenger.email:
            try:
                send_mail(
                    subject="Your SafariPass subscription expires soon",
                    message=(
                        f"Hi {sub.passenger.username},\n\n"
                        f"Your subscription on {sub.route} expires on {_fmt(sub.expiry_date)}.\n\n"
                        f"Renew from Browse Routes to avoid any interruption:\n"
                        f"{settings.FRONTEND_URL}/passenger/browse\n\n"
                        f"— SafariPass"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[sub.passenger.email],
                )
                NotificationLog.objects.create(user=sub.passenger, type='expiry_warning')
            except Exception as e:
                print(f"Failed to send expiry warning to {sub.passenger.email}: {e}")
from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta

from .models import Subscription, RouteShift
from payments.models import ValidationRecord

MAX_ROLLOVER_DAYS = 7


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
    count = 0
    for sub in Subscription.objects.filter(status='active', expiry_date__lt=now):
        expire_subscription(sub)
        count += 1
    return count


@shared_task
def check_unused_days_rollover():
    """Each night, add 1 day back to every active subscription that was not ridden yesterday."""
    from accounts.models import NotificationLog

    yesterday = timezone.localdate() - timedelta(days=1)
    extended = 0

    active_subs = Subscription.objects.filter(status='active', expiry_date__gte=timezone.now())

    for sub in active_subs:
        started_on = timezone.localtime(sub.start_date).date()
        if started_on >= yesterday:
            continue

        if sub.last_rollover_on and sub.last_rollover_on >= yesterday:
            continue

        if sub.rollover_days >= MAX_ROLLOVER_DAYS:
            sub.last_rollover_on = yesterday
            sub.save()
            continue

        rode_yesterday = ValidationRecord.objects.filter(
            subscription=sub,
            scanned_at__date=yesterday,
            result='active',
        ).exists()

        sub.last_rollover_on = yesterday

        if rode_yesterday:
            sub.save()
            continue

        sub.expiry_date = sub.expiry_date + timedelta(days=1)
        sub.rollover_days += 1
        sub.save()
        extended += 1

        passenger = sub.passenger
        if passenger.email:
            try:
                send_mail(
                    subject="Your SafariPass subscription was extended",
                    message=(
                        f"Hi {passenger.username},\n\n"
                        f"You didn't board yesterday ({yesterday.strftime('%a %d %b')}), so we've added "
                        f"1 day back to your subscription on {sub.route.origin} → {sub.route.destination}.\n\n"
                        f"New expiry: {_fmt(sub.expiry_date)}\n"
                        f"Days added back so far: {sub.rollover_days} of {MAX_ROLLOVER_DAYS}\n\n"
                        f"— SafariPass"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[passenger.email],
                )
                NotificationLog.objects.create(user=passenger, type='rollover_extension')
            except Exception as e:
                print(f"Failed to send rollover email to {passenger.email}: {e}")

    return extended


@shared_task
def revert_expired_route_shifts():
    from accounts.models import NotificationLog

    now = timezone.now()
    expired_shifts = RouteShift.objects.filter(status='active', reverted=False, ends_at__lte=now)
    count = 0

    for shift in expired_shifts:
        shift.reverted = True
        shift.save()
        count += 1

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

    return count


@shared_task
def send_expiry_warnings():
    from accounts.models import NotificationLog

    warning_date = timezone.now() + timedelta(days=1)
    expiring_soon = Subscription.objects.filter(
        status='active',
        expiry_date__gte=timezone.now(),
        expiry_date__lte=warning_date,
    )
    count = 0

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
                count += 1
            except Exception as e:
                print(f"Failed to send expiry warning to {sub.passenger.email}: {e}")

    return count
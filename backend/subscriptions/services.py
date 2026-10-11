from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone


def _fmt(dt):
    return timezone.localtime(dt).strftime('%d %b %Y, %I:%M %p')


def activate_route_shift(shift):
    """Make a route shift live, count it against the 3-shift cap, and email the passenger."""
    shift.status = 'active'
    shift.save()

    subscription = shift.subscription
    subscription.shift_count += 1
    subscription.save()

    passenger = subscription.passenger
    if not passenger.email:
        return

    extra_line = ''
    if shift.extra_amount_paid > 0:
        extra_line = f"You paid KES {shift.extra_amount_paid} for the difference in fare.\n\n"

    try:
        send_mail(
            subject="Route Shift Confirmed — SafariPass",
            message=(
                f"Hi {passenger.username},\n\n"
                f"Your subscription has been temporarily shifted from "
                f"{shift.original_route.origin} → {shift.original_route.destination} "
                f"to {shift.temporary_route.origin} → {shift.temporary_route.destination}.\n\n"
                f"{extra_line}"
                f"This shift is active from {_fmt(shift.starts_at)} to {_fmt(shift.ends_at)}.\n\n"
                f"Track your journey live: {settings.FRONTEND_URL}/passenger/map\n\n"
                f"After that time, your pass will automatically return to your original route.\n\n"
                f"— SafariPass"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[passenger.email],
        )
    except Exception as e:
        print(f"Failed to send route shift email to {passenger.email}: {e}")
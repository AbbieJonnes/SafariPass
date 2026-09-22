from django.core.management.base import BaseCommand
from subscriptions.tasks import check_unused_days_rollover, revert_expired_route_shifts


class Command(BaseCommand):
    help = 'Runs the daily rollover and route-shift-revert checks'

    def handle(self, *args, **options):
        check_unused_days_rollover()
        revert_expired_route_shifts()
        self.stdout.write(self.style.SUCCESS('Daily checks completed successfully.'))
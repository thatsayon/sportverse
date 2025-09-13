from django.utils.timezone import now
from .models import VisitCount

def increment_dashboard_visit(dashboard):
    today = now().date()
    visit, created = VisitCount.objects.get_or_create(
        dashboard=dashboard,
        date=today,
        defaults={'visit_count': 0}
    )
    visit.visit_count += 1
    visit.save()


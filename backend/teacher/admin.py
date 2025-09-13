from django.contrib import admin
from .session.models import (
    SessionOption,
    AvailableDay,
    AvailableTimeSlot,
    BookedSession
)
from .dashboard.models import (
    Dashboard,
    VisitCount,
    IncomeHistory,
)

# session models
admin.site.register(SessionOption)
admin.site.register(AvailableDay)
admin.site.register(AvailableTimeSlot)
admin.site.register(BookedSession)

# dashboard models
admin.site.register(Dashboard)
admin.site.register(VisitCount)
admin.site.register(IncomeHistory)

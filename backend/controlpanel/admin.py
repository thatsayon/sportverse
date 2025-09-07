from django.contrib import admin
from .models import Sport, Statistic, MonthlyStatistic, SessionBreakdown

admin.site.register(Sport)
admin.site.register(Statistic)
admin.site.register(MonthlyStatistic)
admin.site.register(SessionBreakdown)

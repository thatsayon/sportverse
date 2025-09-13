from django.contrib import admin
from .models import (
    Sport, 
    Statistic, 
    MonthlyStatistic, 
    SessionBreakdown, 
    TeacherDeduction,
    AdminIncome
)

admin.site.register(Sport)
admin.site.register(Statistic)
admin.site.register(MonthlyStatistic)
admin.site.register(SessionBreakdown)
admin.site.register(TeacherDeduction)
admin.site.register(AdminIncome)

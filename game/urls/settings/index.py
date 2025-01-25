from django.urls import path
from game.views.settings.getinfo import getinfo
from game.views.settings.signin import signin

urlpatterns = [
    path('getinfo/', getinfo , name="settings_getinfo"),
    path('signin/', signin , name="settings_signin"),
]
from django.urls import path , include
from game.views.settings.getinfo import InfoView

from game.views.settings.register import register

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='settings_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('getinfo/', InfoView.as_view() , name="settings_getinfo"),
    #path('signin/', signin , name="settings_signin"),
    #path('signout/', signout , name="settings_signout"),
    path('register/', register , name="settings_register"),
    path('acwing/', include("game.urls.settings.acwing.index")),
]
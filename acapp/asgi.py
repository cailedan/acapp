"""
ASGI config for acapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'acapp.settings')

django.setup() #导入django，不然用thrift时会报错，顺序也很重要，要按照现在这个顺序

# from channels.auth import AuthMiddlewareStack  #将django自带的websocket中间件改掉
from game.channelsmiddleware import JwtAuthMiddleware #引入我们自己写的中间件
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from game.routing import websocket_urlpatterns

from channels.layers import get_channel_layer
channel_layer = get_channel_layer()


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtAuthMiddleware(URLRouter(websocket_urlpatterns))
})

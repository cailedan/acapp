from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from game.models.player.player import Player
class PlayerView(APIView):
    def post(self, request):
        data = request.POST
       # 从数据字典中获取用户名，如果键'username'不存在，则默认返回空字符串
    # 使用strip()方法去除用户名首尾的空白字符，确保数据的整洁性
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        password_confirm = data.get('password_confirm', '').strip()
        if not username or not password:
            return Response({
                'result': '用户名或密码不能为空',
            })
        if password != password_confirm:
            return Response({
                'result': '两次输入的密码不一致',
            })
        if User.objects.filter(username=username).exists():
            return Response({
                'result': '用户名已存在',
            })
        user = User.objects.create_user(username=username, password=password)
        Player.objects.create(user=user , photo='https://picm.sucaisucai.com/dongwubizhi/shijiegedidongwubizhidierji/animal_2008_animal_1680_desktop_02_44726_m.jpg')
       
        return Response({
            'result': 'success',
        })

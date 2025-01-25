from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
       # 从数据字典中获取用户名，如果键'username'不存在，则默认返回空字符串
    # 使用strip()方法去除用户名首尾的空白字符，确保数据的整洁性
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    password_confirm = data.get('password_confirm', '').strip()
    if not username or not password:
        return JsonResponse({
            'result': '用户名或密码不能为空',
        })
    if password != password_confirm:
        return JsonResponse({
            'result': '两次输入的密码不一致',
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': '用户名已存在',
        })
    user = User.objects.create_user(username=username, password=password)
    Player.objects.create(user=user , photo='https://cdn.acwing.com/media/article/image/2021/11/18/1_ea3d5e7448-logo64x64_2.png')
    login(request , user)
    return JsonResponse({
        'result': 'success',
    })
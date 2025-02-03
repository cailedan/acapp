

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

class AvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        player = Player.objects.get(user=user)
        avatar_file = request.FILES.get('avatar')

        if not avatar_file:
            return Response({
                'result': '请上传一个图片文件',
            })

        if not avatar_file.content_type.startswith('image/'):
            return Response({
                'result': '上传的文件不是图片',
            })

        # 保存文件到服务器
        file_path = os.path.join('avatars', f"{user.id}_{avatar_file.name}")
        default_storage.save(file_path, ContentFile(avatar_file.read()))

        # 更新玩家的头像路径
        player.photo = "https://app7342.acapp.acwing.com.cn/media/" + file_path
        print(player.photo)
        player.save()

        return Response({
            'result': 'success',
            'photo': player.photo,
        })
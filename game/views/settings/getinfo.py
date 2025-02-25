from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player

class InfoView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        player = Player.objects.get(user=user)
        return Response({
            'result': 'success',
           
            "photo": player.photo,
            
            "username": user.username,
        })
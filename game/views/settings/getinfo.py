from django.http import JsonResponse
from game.models.player.player import Player


def getinfo_acapp(request):
    player = Player.objects.all()[0]
    return JsonResponse({
        'result': 'success',
        'data': {
            'name': player.user.username,
            'photo': player.photo,
        }
    })


def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': 'fail',
            'error': '用户未登录',
        })
    else:
         player = Player.objects.get(user=request.user)
         return JsonResponse({
            'result': 'success',
            'data': {
                'name': player.user.username,
                'photo': player.photo,
               }
         })



def getinfo(request):
    platform = request.GET.get('platform')
    if platform == 'acapp':
       
        return getinfo_acapp(request)
    elif platform == 'web':
        return getinfo_web(request)

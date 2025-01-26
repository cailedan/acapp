from django.shortcuts import redirect
from django.core.cache import cache
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
from random import randint
from django.http import JsonResponse

def receive_code(request):

    if "errorcode" in request.GET:
        return JsonResponse({
            "result": "apply failed",
            "errorcode": request.GET["errorcode"],
            "errormsg": request.GET["errormsg"],
        })

    code = request.GET.get("code")
    state = request.GET.get("state")
    if not cache.has_key(state):
        return JsonResponse({
            "result": "state not exist",
            
        })
    
    cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        "appid": "7342",
        "secret": "fe940e8a4b974ab9bba22252f06db8b4",
        "code": code
    }
    access_token_res = requests.get(apply_access_token_url , params = params).json()

    access_token = access_token_res["access_token"]
    openid = access_token_res["openid"]

    player = Player.objects.filter(openid = openid) 
    if player.exists():  # 如果这个用户已存在，则无需获取信息，直接登录即可
        player = player[0]
        return JsonResponse({
            "result": "success",
            "username": player.user.username,
            "photo": player.photo,
        })
    
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"

    params = {
        "access_token": access_token,
        "openid": openid
    }

    userinfo_res = requests.get(get_userinfo_url , params = params).json()
    username = userinfo_res["username"]
    photo = userinfo_res["photo"]
    while User.objects.filter(username = username).exists(): #如果用户名已存在，则随机添加数字 
        username += str(randint(0, 9))

    user = User.objects.create(username = username)
    player = Player.objects.create(user = user , photo = photo , openid = openid)


    return JsonResponse({
            "result": "success",
            "username": player.user.username,
            "photo": player.photo,
        })
    
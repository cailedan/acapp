from django.shortcuts import render

from django.http import HttpResponse

def index(request):
    line1 = '<h1 style = "text-align:center">Hello World!</h1>'
    return HttpResponse(line1)
# Create your views here.

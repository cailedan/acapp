from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.URLField(max_length=256 , blank=True)
    openid = models.CharField(default="" ,max_length=64, blank=True , null=True)
    score = models.IntegerField(default=1500)
    avatar = models.ImageField( upload_to='avatars/',max_length=256, null=True,blank=True)
    def __str__(self):
        return str(self.user)
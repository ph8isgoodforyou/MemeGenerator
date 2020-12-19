from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from .views import MemeAPIView

urlpatterns = [
    path(r'meme/<int:pk>/', MemeAPIView.as_view()),
]

import requests
from django.http import JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class MemeAPIView(APIView):
    """
    Retrieve a meme instance.
    """
    def get(self, request, pk):
        response = requests.get('http://alpha-meme-maker.herokuapp.com/memes/' + str(pk) + '/')
        # return HttpResponse(response, content_type='application/json', status=status.HTTP_200_OK)
        return HttpResponse(response, status=status.HTTP_200_OK)

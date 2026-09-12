from rest_framework import generics
from .models import Company, Route, Fare, PlanType
from .serializers import CompanySerializer, RouteSerializer, FareSerializer, PlanTypeSerializer


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class RouteListCreateView(generics.ListCreateAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class FareListCreateView(generics.ListCreateAPIView):
    queryset = Fare.objects.all()
    serializer_class = FareSerializer


class PlanTypeListCreateView(generics.ListCreateAPIView):
    queryset = PlanType.objects.all()
    serializer_class = PlanTypeSerializer
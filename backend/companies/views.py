from rest_framework import generics
from .models import Company, Route, Fare, PlanType
from .serializers import CompanySerializer, RouteSerializer, FareSerializer, PlanTypeSerializer
from accounts.permissions import IsSuperAdmin, IsSuperAdminOrCompanyAdmin


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSuperAdmin()]
        return super().get_permissions()


class RouteListCreateView(generics.ListCreateAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSuperAdminOrCompanyAdmin()]
        return super().get_permissions()


class FareListCreateView(generics.ListCreateAPIView):
    queryset = Fare.objects.all()
    serializer_class = FareSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSuperAdminOrCompanyAdmin()]
        return super().get_permissions()


class PlanTypeListCreateView(generics.ListCreateAPIView):
    queryset = PlanType.objects.all()
    serializer_class = PlanTypeSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSuperAdminOrCompanyAdmin()]
        return super().get_permissions()
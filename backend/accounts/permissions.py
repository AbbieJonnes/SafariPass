from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'super_admin'


class IsCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'company_admin'


class IsSuperAdminOrCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['super_admin', 'company_admin']


class IsConductor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'conductor'


class IsPassenger(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'passenger'


class IsOwnerOrAdmin(BasePermission):
    """Allows access if the object belongs to the requesting user, or user is any admin."""
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['super_admin', 'company_admin']:
            return True
        owner_field = getattr(obj, 'passenger', None) or getattr(obj, 'user', None)
        return owner_field == request.user
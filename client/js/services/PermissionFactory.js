'use strict';
(function () {
    function PermissionFactory($q, $http, $log, toastr) {
        var url = '/access';
        var permissions = [
            "delete",
            "move",
            "copy",
            "create_file",
            "update_file",
            "rename",
            "upload_file",
            "create_folder",
            "download",
            "stream",
            "refresh",
            "settings",
            "service",
            "change_base",
            "favorite",
            "edit_favorite",
            "find"
        ];
        var role = 'elevated';
        var $permissions;

        function init(expiresIn) {
            $permissions = $http.get(url, { params: { t: expiresIn } }).then(function (res) {
                permissions = res.data.permissions;
                role = res.data.role;
            }, function (err) {
                $log.error('Error, while retreiving permission: ', err.status, err.data);
            });
        }

        init();
        return {
            hasPermission: function (permission) {
                return permissions.indexOf(permission) != -1;
            },
            resetPermissions: function () {
                init();
            },
            elevatedPermission: function (expiresIn) {
                init(expiresIn);
            },
            getRole: function () {
                return role;
            },
            $permissions: $permissions
        };
    }

    angular.module('FMApp').factory('PermissionFactory', PermissionFactory);
})();
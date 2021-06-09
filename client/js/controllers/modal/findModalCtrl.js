'use strict';
(function () {
    var FMApp = angular.module('FMApp');

    function FindModalCtrl($scope, $rootScope, $log, $uibModalInstance, FileDownloader, FM, data, $http) {
        var vm = this;
        vm.FM = FM;
        
        var contentHeight = function(expand){
            return expand?$(window).height() -  $('.find .modal-header').outerHeight(true) - $('.find .modal-footer').outerHeight(true) - 24:$(window).height() * 70 / 100;
        }

        $scope.$watch('vm.expand', function(expand){
            $('.find .modal-dialog').toggleClass('expand', expand);
            $('.find .modal-dialog .scroll-glue').height(contentHeight(expand) + 'px');
        });
        $rootScope.$on('resize', function(){
            $('.find .modal-dialog .scroll-glue').height(contentHeight(vm.expand) + 'px');
        });

        // vm.yes = function () {
        //     $http[vm.editMode?'put':'post']('api' + (vm.editMode?FM.selection[0].relPath:FM.curFolderPath+vm.fileName), {content:vm.content}, {params: {type: 'WRITE_FILE'}}).then(function(data){
        //         FM.successData = data.data;
        //         $uibModalInstance.close();
        //     }, function(data){
        //         FM.errorData = data.status + ': ' + data.data;
        //     });
        // };

        vm.yes = function () {
            $http.post('find', {criteria: this.criteria}, {params: {base: FM.BasePath.activePath()}}).then(function(data){
                FM.successData = data.data;
                $uibModalInstance.close();
            }, function(data){
                FM.errorData = data.status + ': ' + data.data;
            });
        };

        vm.no = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.init = function () {
            $log.debug('FindModalCtrl.init() invoked ...');
        };

        vm.init();
    }

    FMApp.controller('FindModalCtrl', FindModalCtrl);
})();
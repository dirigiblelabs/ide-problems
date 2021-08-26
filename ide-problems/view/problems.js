/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company and Eclipse Dirigible contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: 2021 SAP SE or an SAP affiliate company and Eclipse Dirigible contributors
 * SPDX-License-Identifier: EPL-2.0
 */
angular.module('problems', [])
    .controller('ProblemsController', ['$scope', '$http', function ($scope, $http) {
        $scope.selectAll = false;

        function refreshList() {
            $http.get('../../../ops/problems').then(function(response) {
                $scope.problemsList = response.data;
            });
            $scope.selectAll = false;
        }

        refreshList();

        function filterSelectedIds() {
            let selectedIds = [];
            $scope.problemsList.filter(
                function (problem) {
                    if (problem.checked) {
                        selectedIds.push(problem.id)
                    }
                }
            );
            return selectedIds;
        }

        this.refresh = function () {
            refreshList();
        }

        $scope.checkAll = function() {
            angular.forEach($scope.problemsList, function (problem) {
                problem.checked = $scope.selectAll;
            });
        };

        $scope.updateStatus = function(status) {
            $http.post('../../../ops/problems/update/' + status, filterSelectedIds()).then(function(response) {
                $scope.problemsList = response.data;
                $scope.selectAll = false;
            });
        };

        $scope.deleteByStatus = function(status) {
            $http.delete('../../../ops/problems/delete/' + status).success(function () {
                refreshList();
            });
        }

        $scope.deleteSelected = function() {
            $http.post('../../../ops/problems/delete/selected', filterSelectedIds()).success(function () {
                refreshList();
            });
        }

        $scope.clear = function() {
            $http.delete('../../../ops/problems/clear').success(function () {
                $scope.problemsList = [];
                $scope.selectAll = false;
            });
        }
    }]).config(function($sceProvider) {
    $sceProvider.enabled(false);
});
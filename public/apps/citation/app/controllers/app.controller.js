(function() {
    'use strict';

    angular
        .module('citationApp')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope', '$q', 'DataStore'];

    function AppCtrl($scope, $q, DataStore) {

        $scope.isEdit = false;
        $scope.hasError = false;
        $scope.hasResult = false;
        $scope.apiCallLoading = false;
        $scope.productsDetailArray = [];
        $scope.currencies = ['Eur'];
        $scope.productsReference = ['ZMSI'];
        $scope.criteria = {};
        $scope.searchByCriteria = searchByCriteria;
        $scope.addNewRow = addNewRow;
        $scope.saveRow = saveRow;
        $scope.editRow = editRow;
        $scope.removeRow = removeRow;
        $scope.notification = "";

        // init();

        function init() {
            var promises = [getJsonData()];
            $q.all(promises).then(function() {
                console.log('The citation vies is ready');
            });
        }

        function saveRow(product) {
          product.saved = true;
        }

        function editRow(product) {
          product.saved = false;
        }

        function removeRow(product) {
          $scope.productsDetailArray.pop();
          console.log(product);
        }

        function addNewRow() {
          $scope.productsDetailArray.push({});
        }

        function searchByCriteria(criteria) {
          let validationResult = isSearchCriteriaValid(criteria);
          if (validationResult.isValid) {
            $scope.apiCallLoading = true;
            getJsonData(criteria);
          } else {
            $scope.notification = validationResult.message;
            $scope.hasError = true;
            $scope.hasResult = false;
            $scope.apiCallLoading = false;
          }
        }

        function isSearchCriteriaValid(criteria) {
          if(!criteria.startingDate) {
              return {isValid: false, message: 'Starting date is required'};
          } else if(!criteria.productReference) {
              return {isValid: false, message: 'Product reference is required'};
          } else if(!criteria.currency) {
              return {isValid: false, message: 'Currency is required'};
          } else if(!criteria.numberOfPax) {
              return {isValid: false, message: 'Number of pax is required'};
          } else if(!criteria.numberOfLeaders) {
              return {isValid: false, message: 'Number of leaders is required'};
          } else {
            return {isValid: true, message: ''};
          }
        }

        function getJsonData(criteriaObj) {
            DataStore.getExcelData(criteriaObj)
              .then(function(jsonData) {
                console.log(jsonData);
                $scope.productsDetailArray = jsonData;
                $scope.hasResult = true;
                $scope.hasError = false;
                $scope.apiCallLoading = false;
              })
              .catch(function(err) {
                $scope.notification = err.message;
                $scope.hasError = true;
                $scope.hasResult = false;
                $scope.apiCallLoading = false;
                console.error(err);
              });
        }
    }

})();

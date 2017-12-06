var node_xj = require("xls-to-json");

exports.filteredResult = function(productReference, callback) {
  node_xj({
    input: "public/apps/citation/data/"+productReference+".xls",  // input xls
    output: ""+productReference+".json", // output json
    sheet: "Elements Departure Costing"  // specific sheetname
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      var filteredResult = filterRecords(result, 'PaymentArrangementName', 'Invoice');
      // console.log('****************************************************************');
      // console.log(filteredResult);
      // console.log('****************************************************************');

      callback(filteredResult);
    }
  });
};

var filterRecords = function(dataArray, filterColumn, filterCriteria) {
  var filteredArray = [];
  for(var arrayIte = 0; arrayIte < dataArray.length; arrayIte++) {
    if (dataArray[arrayIte][filterColumn] !== filterCriteria) {
      filteredArray.push(dataArray[arrayIte]);
    }
  }

  return filteredArray;
};

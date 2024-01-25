"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FindAll;

var _Builder = _interopRequireWildcard(require("../Query/Builder"));

var _EagerUtils = require("../Query/EagerUtils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function FindAll(neode, model, properties, order, limit, skip) {
  var alias = 'this';
  var builder = new _Builder["default"](neode); // Match

  builder.match(alias, model); // Where

  if (properties) {
    Object.keys(properties).forEach(function (key) {
      builder.where("".concat(alias, ".").concat(key), properties[key]);
    });
  } // Order


  if (typeof order == 'string') {
    builder.orderBy("".concat(alias, ".").concat(order));
  } else if (_typeof(order) == 'object') {
    Object.keys(order).forEach(function (key) {
      builder.orderBy("".concat(alias, ".").concat(key), order[key]);
    });
  } // Output


  var output = (0, _EagerUtils.eagerNode)(neode, 1, alias, model);
  return builder["return"](output).limit(limit).skip(skip).execute(_Builder.mode.READ).then(function (res) {
    return neode.hydrate(res, alias);
  });
}
//# sourceMappingURL=FindAll.js.map
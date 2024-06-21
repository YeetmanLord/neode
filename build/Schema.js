"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function UniqueConstraintCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  return "".concat(mode, " CONSTRAINT FOR (model:").concat(label, ") REQUIRE model.").concat(property, " IS UNIQUE");
}
function ExistsConstraintCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  return "".concat(mode, " CONSTRAINT FOR (model:").concat(label, ") REQUIRE EXISTS(model.").concat(property, ")");
}
function IndexCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  return "".concat(mode, " INDEX FOR :").concat(label, "(").concat(property, ")");
}
function FullTextIndexCypher(label, property, model) {
  var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'CREATE';
  return "".concat(mode, " FULLTEXT INDEX ").concat(label, " FOR (n:").concat(model, ") ON (n.").concat(property, ")");
}
function runAsync(session, queries, resolve, reject) {
  var next = queries.pop();
  return session.run(next).then(function () {
    // If there is another query, let's run it
    if (queries.length) {
      return runAsync(session, queries, resolve, reject);
    }

    // Close Session and resolve
    session.close();
    resolve();
  })["catch"](function (e) {
    reject(e);
  });
}
function InstallSchema(neode) {
  var queries = [];
  neode.models.forEach(function (model, label) {
    model.properties().forEach(function (property) {
      // Constraints
      if (property.primary() || property.unique()) {
        queries.push(UniqueConstraintCypher(label, property.name()));
      }
      if (neode.enterprise() && property.required()) {
        queries.push(ExistsConstraintCypher(label, property.name()));
      }

      // Indexes
      if (property.indexed()) {
        queries.push(IndexCypher(label, property.name()));
      }

      // Full text indexes
      if (property.fullTextIndexed()) {
        queries.push(FullTextIndexCypher(label, property.name(), model.name()));
      }
    });
  });
  return neode.batch(queries);
}
function DropSchema(neode) {
  var queries = [];
  neode.models.forEach(function (model, label) {
    model.properties().forEach(function (property) {
      // Constraints
      if (property.unique()) {
        queries.push(UniqueConstraintCypher(label, property.name(), 'DROP'));
      }
      if (neode.enterprise() && property.required()) {
        queries.push(ExistsConstraintCypher(label, property.name(), 'DROP'));
      }

      // Indexes
      if (property.indexed()) {
        queries.push(IndexCypher(label, property.name(), 'DROP'));
      }
    });
  });
  var session = neode.writeSession();
  return new Promise(function (resolve, reject) {
    runAsync(session, queries, resolve, reject);
  });
}
var Schema = exports["default"] = /*#__PURE__*/function () {
  function Schema(neode) {
    _classCallCheck(this, Schema);
    this.neode = neode;
  }
  _createClass(Schema, [{
    key: "install",
    value: function install() {
      return InstallSchema(this.neode);
    }
  }, {
    key: "drop",
    value: function drop() {
      return DropSchema(this.neode);
    }
  }]);
  return Schema;
}();
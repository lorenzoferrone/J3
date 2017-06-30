'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getById = exports.clone = exports.tree = undefined;

var _treeModel = require('tree-model');

var _treeModel2 = _interopRequireDefault(_treeModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tree = exports.tree = new _treeModel2.default();

var clone = exports.clone = function clone(object) {
  return tree.parse(object.model);
};

var getById = exports.getById = function getById(t, id) {
  return t.first(function (node) {
    return node.model.id == id;
  });
};
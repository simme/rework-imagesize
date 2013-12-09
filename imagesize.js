//
// # Rework Imagesize
//

/* jslint node: true */
"use strict";

var imagesize = require('imagesize').Parser;
var visit     = require('rework-visit');
var fs        = require('fs');
var path      = require('path');

var METHODS = ['imgsize', 'imgsizew', 'imgsizeh'];

module.exports = function (dir) {
  return function (stylesheet) {
    visit(stylesheet, function (declarations, rule) {
      var add = [];
      declarations.forEach(function (r, index, arr) {
        if (METHODS.indexOf(r.property) !== -1) {
          var s = size(dir, r.value);
          if (s) {
            add = setDeclarations(s, r.property);
          }
          else {
            throw new Error(
              'Failed to get image size of: '+ path.join(dir, r.value)
            );
          }

          declarations.splice(index, 1);
        }
      });

      add.forEach(function (item) {
        declarations.push(item);
      });
    });
  };
};

// @TODO: Could be made smarter by incrementally reading more data as needed
// using fs.readSync();
function size(dir, name) {
  var parser = imagesize();
  var data   = fs.readFileSync(path.join(dir, name));
  var result = false;
  switch (parser.parse(data)) {
    case imagesize.DONE:
      result = parser.getResult();
      break;
  }

  return result;
}

function setDeclarations(s, property) {
  var add       = [];
  var getWidth  = false;
  var getHeight = false;

  // This is beutiful code.
  var last      = property.substr(-1, 1);
  switch (last) {
    case 'w':
      getWidth  = true;
      break;
    case 'h':
      getHeight = true;
      break;
    default:
      getWidth  = true;
      getHeight = true;
      break;
  }

  var d = 'declaration';
  if (getWidth) {
    add.push({type: d, property: 'width', value: s.width + 'px'});
  }
  if (getHeight) {
    add.push({type: d, property: 'height', value: s.height + 'px'});
  }

  return add;
}


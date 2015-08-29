exports.__esModule = true;

var _arrayUtils = require("./array-utils");

// The HTML elements in this list are speced by
// http://www.w3.org/TR/html-markup/syntax.html#syntax-elements,
// and will be forced to close regardless of if they have a
// self-closing /> at the end.
var voidTagNames = "area base br col command embed hr img input keygen link meta param source track wbr";
var voidMap = {};

_arrayUtils.forEach(voidTagNames.split(" "), function (tagName) {
  voidMap[tagName] = true;
});

exports.default = voidMap;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWxiYXJzLXV0aWwvdm9pZC10YWctbmFtZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7MEJBQXdCLGVBQWU7Ozs7OztBQU12QyxJQUFJLFlBQVksR0FBRyxxRkFBcUYsQ0FBQztBQUN6RyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLG9CQUFRLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBUyxPQUFPLEVBQUU7QUFDakQsU0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztDQUN6QixDQUFDLENBQUM7O2tCQUVZLE9BQU8iLCJmaWxlIjoiaHRtbGJhcnMtdXRpbC92b2lkLXRhZy1uYW1lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvckVhY2ggfSBmcm9tIFwiLi9hcnJheS11dGlsc1wiO1xuXG4vLyBUaGUgSFRNTCBlbGVtZW50cyBpbiB0aGlzIGxpc3QgYXJlIHNwZWNlZCBieVxuLy8gaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbC1tYXJrdXAvc3ludGF4Lmh0bWwjc3ludGF4LWVsZW1lbnRzLFxuLy8gYW5kIHdpbGwgYmUgZm9yY2VkIHRvIGNsb3NlIHJlZ2FyZGxlc3Mgb2YgaWYgdGhleSBoYXZlIGFcbi8vIHNlbGYtY2xvc2luZyAvPiBhdCB0aGUgZW5kLlxudmFyIHZvaWRUYWdOYW1lcyA9IFwiYXJlYSBiYXNlIGJyIGNvbCBjb21tYW5kIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnJcIjtcbnZhciB2b2lkTWFwID0ge307XG5cbmZvckVhY2godm9pZFRhZ05hbWVzLnNwbGl0KFwiIFwiKSwgZnVuY3Rpb24odGFnTmFtZSkge1xuICB2b2lkTWFwW3RhZ05hbWVdID0gdHJ1ZTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB2b2lkTWFwO1xuIl19
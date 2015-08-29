exports.__esModule = true;
exports.sanitizeAttributeValue = sanitizeAttributeValue;
/* jshint scripturl:true */

var badProtocols = {
  'javascript:': true,
  'vbscript:': true
};

var badTags = {
  'A': true,
  'BODY': true,
  'LINK': true,
  'IMG': true,
  'IFRAME': true,
  'BASE': true,
  'FORM': true
};

var badTagsForDataURI = {
  'EMBED': true
};

var badAttributes = {
  'href': true,
  'src': true,
  'background': true,
  'action': true
};

exports.badAttributes = badAttributes;
var badAttributesForDataURI = {
  'src': true
};

function sanitizeAttributeValue(dom, element, attribute, value) {
  var tagName;

  if (!element) {
    tagName = null;
  } else {
    tagName = element.tagName.toUpperCase();
  }

  if (value && value.toHTML) {
    return value.toHTML();
  }

  if ((tagName === null || badTags[tagName]) && badAttributes[attribute]) {
    var protocol = dom.protocolForURL(value);
    if (badProtocols[protocol] === true) {
      return 'unsafe:' + value;
    }
  }

  if (badTagsForDataURI[tagName] && badAttributesForDataURI[attribute]) {
    return 'unsafe:' + value;
  }

  return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vcnBoLWF0dHIvc2FuaXRpemUtYXR0cmlidXRlLXZhbHVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFJLFlBQVksR0FBRztBQUNqQixlQUFhLEVBQUUsSUFBSTtBQUNuQixhQUFXLEVBQUUsSUFBSTtDQUNsQixDQUFDOztBQUVGLElBQUksT0FBTyxHQUFHO0FBQ1osS0FBRyxFQUFFLElBQUk7QUFDVCxRQUFNLEVBQUUsSUFBSTtBQUNaLFFBQU0sRUFBRSxJQUFJO0FBQ1osT0FBSyxFQUFFLElBQUk7QUFDWCxVQUFRLEVBQUUsSUFBSTtBQUNkLFFBQU0sRUFBRSxJQUFJO0FBQ1osUUFBTSxFQUFFLElBQUk7Q0FDYixDQUFDOztBQUVGLElBQUksaUJBQWlCLEdBQUc7QUFDdEIsU0FBTyxFQUFFLElBQUk7Q0FDZCxDQUFDOztBQUVLLElBQUksYUFBYSxHQUFHO0FBQ3pCLFFBQU0sRUFBRSxJQUFJO0FBQ1osT0FBSyxFQUFFLElBQUk7QUFDWCxjQUFZLEVBQUUsSUFBSTtBQUNsQixVQUFRLEVBQUUsSUFBSTtDQUNmLENBQUM7OztBQUVGLElBQUksdUJBQXVCLEdBQUc7QUFDNUIsT0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOztBQUVLLFNBQVMsc0JBQXNCLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO0FBQ3JFLE1BQUksT0FBTyxDQUFDOztBQUVaLE1BQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixXQUFPLEdBQUcsSUFBSSxDQUFDO0dBQ2hCLE1BQU07QUFDTCxXQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUN6Qzs7QUFFRCxNQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFdBQU8sS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ3ZCOztBQUVELE1BQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQSxJQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUN0RSxRQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLFFBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtBQUNuQyxhQUFPLFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDMUI7R0FDRjs7QUFFRCxNQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3BFLFdBQU8sU0FBUyxHQUFHLEtBQUssQ0FBQztHQUMxQjs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkIiwiZmlsZSI6Im1vcnBoLWF0dHIvc2FuaXRpemUtYXR0cmlidXRlLXZhbHVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IHNjcmlwdHVybDp0cnVlICovXG5cbnZhciBiYWRQcm90b2NvbHMgPSB7XG4gICdqYXZhc2NyaXB0Oic6IHRydWUsXG4gICd2YnNjcmlwdDonOiB0cnVlXG59O1xuXG52YXIgYmFkVGFncyA9IHtcbiAgJ0EnOiB0cnVlLFxuICAnQk9EWSc6IHRydWUsXG4gICdMSU5LJzogdHJ1ZSxcbiAgJ0lNRyc6IHRydWUsXG4gICdJRlJBTUUnOiB0cnVlLFxuICAnQkFTRSc6IHRydWUsXG4gICdGT1JNJzogdHJ1ZVxufTtcblxudmFyIGJhZFRhZ3NGb3JEYXRhVVJJID0ge1xuICAnRU1CRUQnOiB0cnVlXG59O1xuXG5leHBvcnQgdmFyIGJhZEF0dHJpYnV0ZXMgPSB7XG4gICdocmVmJzogdHJ1ZSxcbiAgJ3NyYyc6IHRydWUsXG4gICdiYWNrZ3JvdW5kJzogdHJ1ZSxcbiAgJ2FjdGlvbic6IHRydWVcbn07XG5cbnZhciBiYWRBdHRyaWJ1dGVzRm9yRGF0YVVSSSA9IHtcbiAgJ3NyYyc6IHRydWVcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUF0dHJpYnV0ZVZhbHVlKGRvbSwgZWxlbWVudCwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICB2YXIgdGFnTmFtZTtcblxuICBpZiAoIWVsZW1lbnQpIHtcbiAgICB0YWdOYW1lID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvVXBwZXJDYXNlKCk7XG4gIH1cblxuICBpZiAodmFsdWUgJiYgdmFsdWUudG9IVE1MKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvSFRNTCgpO1xuICB9XG5cbiAgaWYgKCh0YWdOYW1lID09PSBudWxsIHx8IGJhZFRhZ3NbdGFnTmFtZV0pICYmIGJhZEF0dHJpYnV0ZXNbYXR0cmlidXRlXSkge1xuICAgIHZhciBwcm90b2NvbCA9IGRvbS5wcm90b2NvbEZvclVSTCh2YWx1ZSk7XG4gICAgaWYgKGJhZFByb3RvY29sc1twcm90b2NvbF0gPT09IHRydWUpIHtcbiAgICAgIHJldHVybiAndW5zYWZlOicgKyB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoYmFkVGFnc0ZvckRhdGFVUklbdGFnTmFtZV0gJiYgYmFkQXR0cmlidXRlc0ZvckRhdGFVUklbYXR0cmlidXRlXSkge1xuICAgIHJldHVybiAndW5zYWZlOicgKyB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cbiJdfQ==
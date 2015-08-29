exports.__esModule = true;
exports.default = build;

function build(ast) {
  if (!ast) {
    return '';
  }
  var output = [];

  switch (ast.type) {
    case 'Program':
      {
        var chainBlock = ast.chained && ast.body[0];
        if (chainBlock) {
          chainBlock.chained = true;
        }
        var body = buildEach(ast.body).join('');
        output.push(body);
      }
      break;
    case 'ElementNode':
      output.push('<', ast.tag);
      if (ast.attributes.length) {
        output.push(' ', buildEach(ast.attributes).join(' '));
      }
      if (ast.modifiers.length) {
        output.push(' ', buildEach(ast.modifiers).join(' '));
      }
      output.push('>');
      output.push.apply(output, buildEach(ast.children));
      output.push('</', ast.tag, '>');
      break;
    case 'AttrNode':
      output.push(ast.name, '=');
      var value = build(ast.value);
      if (ast.value.type === 'TextNode') {
        output.push('"', value, '"');
      } else {
        output.push(value);
      }
      break;
    case 'ConcatStatement':
      output.push('"');
      ast.parts.forEach(function (node) {
        if (node.type === 'StringLiteral') {
          output.push(node.original);
        } else {
          output.push(build(node));
        }
      });
      output.push('"');
      break;
    case 'TextNode':
      output.push(ast.chars);
      break;
    case 'MustacheStatement':
      {
        output.push(compactJoin(['{{', pathParams(ast), '}}']));
      }
      break;
    case 'ElementModifierStatement':
      {
        output.push(compactJoin(['{{', pathParams(ast), '}}']));
      }
      break;
    case 'PathExpression':
      output.push(ast.original);
      break;
    case 'SubExpression':
      {
        output.push('(', pathParams(ast), ')');
      }
      break;
    case 'BooleanLiteral':
      output.push(ast.value ? 'true' : false);
      break;
    case 'BlockStatement':
      {
        var lines = [];

        if (ast.chained) {
          lines.push(['{{else ', pathParams(ast), '}}'].join(''));
        } else {
          lines.push(openBlock(ast));
        }

        lines.push(build(ast.program));

        if (ast.inverse) {
          if (!ast.inverse.chained) {
            lines.push('{{else}}');
          }
          lines.push(build(ast.inverse));
        }

        if (!ast.chained) {
          lines.push(closeBlock(ast));
        }

        output.push(lines.join(''));
      }
      break;
    case 'PartialStatement':
      {
        output.push(compactJoin(['{{>', pathParams(ast), '}}']));
      }
      break;
    case 'CommentStatement':
      {
        output.push(compactJoin(['<!--', ast.value, '-->']));
      }
      break;
    case 'StringLiteral':
      {
        output.push('"' + ast.value + '"');
      }
      break;
    case 'NumberLiteral':
      {
        output.push(ast.value);
      }
      break;
    case 'UndefinedLiteral':
      {
        output.push('undefined');
      }
      break;
    case 'NullLiteral':
      {
        output.push('null');
      }
      break;
    case 'Hash':
      {
        output.push(ast.pairs.map(function (pair) {
          return build(pair);
        }).join(' '));
      }
      break;
    case 'HashPair':
      {
        output.push(ast.key + '=' + build(ast.value));
      }
      break;
  }
  return output.join('');
}

function compact(array) {
  var newArray = [];
  array.forEach(function (a) {
    if (typeof a !== 'undefined' && a !== null && a !== '') {
      newArray.push(a);
    }
  });
  return newArray;
}

function buildEach(asts) {
  var output = [];
  asts.forEach(function (node) {
    output.push(build(node));
  });
  return output;
}

function pathParams(ast) {
  var name = build(ast.name);
  var path = build(ast.path);
  var params = buildEach(ast.params).join(' ');
  var hash = build(ast.hash);
  return compactJoin([name, path, params, hash], ' ');
}

function compactJoin(array, delimiter) {
  return compact(array).join(delimiter || '');
}

function blockParams(block) {
  var params = block.program.blockParams;
  if (params.length) {
    return ' as |' + params.join(',') + '|';
  }
}

function openBlock(block) {
  return ['{{#', pathParams(block), blockParams(block), '}}'].join('');
}

function closeBlock(block) {
  return ['{{/', build(block.path), '}}'].join('');
}
module.exports = exports.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWxiYXJzLXN5bnRheC9nZW5lcmF0aW9uL3ByaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7a0JBQXdCLEtBQUs7O0FBQWQsU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ2pDLE1BQUcsQ0FBQyxHQUFHLEVBQUU7QUFDUCxXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVsQixVQUFPLEdBQUcsQ0FBQyxJQUFJO0FBQ2IsU0FBSyxTQUFTO0FBQUU7QUFDZCxZQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsWUFBRyxVQUFVLEVBQUU7QUFDYixvQkFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDM0I7QUFDRCxZQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxQyxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ25CO0FBQ0QsWUFBTTtBQUFBLEFBQ04sU0FBSyxhQUFhO0FBQ2hCLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixVQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQ3hCLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7T0FDdkQ7QUFDRCxVQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENB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QUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ3RFOztBQUVELFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUN6QixTQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ2xEIiwiZmlsZSI6Imh0bWxiYXJzLXN5bnRheC9nZW5lcmF0aW9uL3ByaW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGQoYXN0KSB7XG4gIGlmKCFhc3QpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgY29uc3Qgb3V0cHV0ID0gW107XG5cbiAgc3dpdGNoKGFzdC50eXBlKSB7XG4gICAgY2FzZSAnUHJvZ3JhbSc6IHtcbiAgICAgIGNvbnN0IGNoYWluQmxvY2sgPSBhc3QuY2hhaW5lZCAmJiBhc3QuYm9keVswXTtcbiAgICAgIGlmKGNoYWluQmxvY2spIHtcbiAgICAgICAgY2hhaW5CbG9jay5jaGFpbmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJvZHkgPSBidWlsZEVhY2goYXN0LmJvZHkpLmpvaW4oJycpO1xuICAgICAgb3V0cHV0LnB1c2goYm9keSk7XG4gICAgfVxuICAgIGJyZWFrO1xuICAgIGNhc2UgJ0VsZW1lbnROb2RlJzpcbiAgICAgIG91dHB1dC5wdXNoKCc8JywgYXN0LnRhZyk7XG4gICAgICBpZihhc3QuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goJyAnLCBidWlsZEVhY2goYXN0LmF0dHJpYnV0ZXMpLmpvaW4oJyAnKSk7XG4gICAgICB9XG4gICAgICBpZihhc3QubW9kaWZpZXJzLmxlbmd0aCkge1xuICAgICAgICBvdXRwdXQucHVzaCgnICcsIGJ1aWxkRWFjaChhc3QubW9kaWZpZXJzKS5qb2luKCcgJykpO1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goJz4nKTtcbiAgICAgIG91dHB1dC5wdXNoLmFwcGx5KG91dHB1dCwgYnVpbGRFYWNoKGFzdC5jaGlsZHJlbikpO1xuICAgICAgb3V0cHV0LnB1c2goJzwvJywgYXN0LnRhZywgJz4nKTtcbiAgICBicmVhaztcbiAgICBjYXNlICdBdHRyTm9kZSc6XG4gICAgICBvdXRwdXQucHVzaChhc3QubmFtZSwgJz0nKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gYnVpbGQoYXN0LnZhbHVlKTtcbiAgICAgIGlmKGFzdC52YWx1ZS50eXBlID09PSAnVGV4dE5vZGUnKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKCdcIicsIHZhbHVlLCAnXCInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICBicmVhaztcbiAgICBjYXNlICdDb25jYXRTdGF0ZW1lbnQnOlxuICAgICAgb3V0cHV0LnB1c2goJ1wiJyk7XG4gICAgICBhc3QucGFydHMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIGlmKG5vZGUudHlwZSA9PT0gJ1N0cmluZ0xpdGVyYWwnKSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gobm9kZS5vcmlnaW5hbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2goYnVpbGQobm9kZSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG91dHB1dC5wdXNoKCdcIicpO1xuICAgIGJyZWFrO1xuICAgIGNhc2UgJ1RleHROb2RlJzpcbiAgICAgIG91dHB1dC5wdXNoKGFzdC5jaGFycyk7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnTXVzdGFjaGVTdGF0ZW1lbnQnOiB7XG4gICAgICBvdXRwdXQucHVzaChjb21wYWN0Sm9pbihbJ3t7JywgcGF0aFBhcmFtcyhhc3QpLCAnfX0nXSkpO1xuICAgIH1cbiAgICBicmVhaztcbiAgICBjYXNlICdFbGVtZW50TW9kaWZpZXJTdGF0ZW1lbnQnOiB7XG4gICAgICBvdXRwdXQucHVzaChjb21wYWN0Sm9pbihbJ3t7JywgcGF0aFBhcmFtcyhhc3QpLCAnfX0nXSkpO1xuICAgIH1cbiAgICBicmVhaztcbiAgICBjYXNlICdQYXRoRXhwcmVzc2lvbic6XG4gICAgICBvdXRwdXQucHVzaChhc3Qub3JpZ2luYWwpO1xuICAgIGJyZWFrO1xuICAgIGNhc2UgJ1N1YkV4cHJlc3Npb24nOiB7XG4gICAgICBvdXRwdXQucHVzaCgnKCcsIHBhdGhQYXJhbXMoYXN0KSwgJyknKTtcbiAgICB9XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnQm9vbGVhbkxpdGVyYWwnOlxuICAgICAgb3V0cHV0LnB1c2goYXN0LnZhbHVlID8gJ3RydWUnIDogZmFsc2UpO1xuICAgIGJyZWFrO1xuICAgIGNhc2UgJ0Jsb2NrU3RhdGVtZW50Jzoge1xuICAgICAgY29uc3QgbGluZXMgPSBbXTtcblxuICAgICAgaWYoYXN0LmNoYWluZWQpe1xuICAgICAgICBsaW5lcy5wdXNoKFsne3tlbHNlICcsIHBhdGhQYXJhbXMoYXN0KSwgJ319J10uam9pbignJykpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGxpbmVzLnB1c2gob3BlbkJsb2NrKGFzdCkpO1xuICAgICAgfVxuXG4gICAgICBsaW5lcy5wdXNoKGJ1aWxkKGFzdC5wcm9ncmFtKSk7XG5cbiAgICAgIGlmKGFzdC5pbnZlcnNlKSB7XG4gICAgICAgIGlmKCFhc3QuaW52ZXJzZS5jaGFpbmVkKXtcbiAgICAgICAgICBsaW5lcy5wdXNoKCd7e2Vsc2V9fScpO1xuICAgICAgICB9XG4gICAgICAgIGxpbmVzLnB1c2goYnVpbGQoYXN0LmludmVyc2UpKTtcbiAgICAgIH1cblxuICAgICAgaWYoIWFzdC5jaGFpbmVkKXtcbiAgICAgICAgbGluZXMucHVzaChjbG9zZUJsb2NrKGFzdCkpO1xuICAgICAgfVxuXG4gICAgICBvdXRwdXQucHVzaChsaW5lcy5qb2luKCcnKSk7XG4gICAgfVxuICAgIGJyZWFrO1xuICAgIGNhc2UgJ1BhcnRpYWxTdGF0ZW1lbnQnOiB7XG4gICAgICBvdXRwdXQucHVzaChjb21wYWN0Sm9pbihbJ3t7PicsIHBhdGhQYXJhbXMoYXN0KSwgJ319J10pKTtcbiAgICB9XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnQ29tbWVudFN0YXRlbWVudCc6IHtcbiAgICAgIG91dHB1dC5wdXNoKGNvbXBhY3RKb2luKFsnPCEtLScsIGFzdC52YWx1ZSwgJy0tPiddKSk7XG4gICAgfVxuICAgIGJyZWFrO1xuICAgIGNhc2UgJ1N0cmluZ0xpdGVyYWwnOiB7XG4gICAgICBvdXRwdXQucHVzaChgXCIke2FzdC52YWx1ZX1cImApO1xuICAgIH1cbiAgICBicmVhaztcbiAgICBjYXNlICdOdW1iZXJMaXRlcmFsJzoge1xuICAgICAgb3V0cHV0LnB1c2goYXN0LnZhbHVlKTtcbiAgICB9XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnVW5kZWZpbmVkTGl0ZXJhbCc6IHtcbiAgICAgIG91dHB1dC5wdXNoKCd1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnTnVsbExpdGVyYWwnOiB7XG4gICAgICBvdXRwdXQucHVzaCgnbnVsbCcpO1xuICAgIH1cbiAgICBicmVhaztcbiAgICBjYXNlICdIYXNoJzoge1xuICAgICAgb3V0cHV0LnB1c2goYXN0LnBhaXJzLm1hcChmdW5jdGlvbihwYWlyKSB7XG4gICAgICAgIHJldHVybiBidWlsZChwYWlyKTtcbiAgICAgIH0pLmpvaW4oJyAnKSk7XG4gICAgfVxuICAgIGJyZWFrO1xuICAgIGNhc2UgJ0hhc2hQYWlyJzoge1xuICAgICAgb3V0cHV0LnB1c2goYCR7YXN0LmtleX09JHtidWlsZChhc3QudmFsdWUpfWApO1xuICAgIH1cbiAgICBicmVhaztcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBjb21wYWN0KGFycmF5KSB7XG4gIGNvbnN0IG5ld0FycmF5ID0gW107XG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24oYSkge1xuICAgIGlmKHR5cGVvZihhKSAhPT0gJ3VuZGVmaW5lZCcgJiYgYSAhPT0gbnVsbCAmJiBhICE9PSAnJykge1xuICAgICAgbmV3QXJyYXkucHVzaChhKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbmV3QXJyYXk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRWFjaChhc3RzKSB7XG4gIGNvbnN0IG91dHB1dCA9IFtdO1xuICBhc3RzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgIG91dHB1dC5wdXNoKGJ1aWxkKG5vZGUpKTtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbmZ1bmN0aW9uIHBhdGhQYXJhbXMoYXN0KSB7XG4gIGNvbnN0IG5hbWUgPSBidWlsZChhc3QubmFtZSk7XG4gIGNvbnN0IHBhdGggPSBidWlsZChhc3QucGF0aCk7XG4gIGNvbnN0IHBhcmFtcyA9IGJ1aWxkRWFjaChhc3QucGFyYW1zKS5qb2luKCcgJyk7XG4gIGNvbnN0IGhhc2ggPSBidWlsZChhc3QuaGFzaCk7XG4gIHJldHVybiBjb21wYWN0Sm9pbihbbmFtZSwgcGF0aCwgcGFyYW1zLCBoYXNoXSwgJyAnKTtcbn1cblxuZnVuY3Rpb24gY29tcGFjdEpvaW4oYXJyYXksIGRlbGltaXRlcikge1xuICByZXR1cm4gY29tcGFjdChhcnJheSkuam9pbihkZWxpbWl0ZXIgfHwgJycpO1xufVxuXG5mdW5jdGlvbiBibG9ja1BhcmFtcyhibG9jaykge1xuICBjb25zdCBwYXJhbXMgPSBibG9jay5wcm9ncmFtLmJsb2NrUGFyYW1zO1xuICBpZihwYXJhbXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGAgYXMgfCR7cGFyYW1zLmpvaW4oJywnKX18YDtcbiAgfVxufVxuXG5mdW5jdGlvbiBvcGVuQmxvY2soYmxvY2spIHtcbiAgcmV0dXJuIFsne3sjJywgcGF0aFBhcmFtcyhibG9jayksIGJsb2NrUGFyYW1zKGJsb2NrKSwgJ319J10uam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGNsb3NlQmxvY2soYmxvY2spIHtcbiAgcmV0dXJuIFsne3svJywgYnVpbGQoYmxvY2sucGF0aCksICd9fSddLmpvaW4oJycpO1xufVxuIl19
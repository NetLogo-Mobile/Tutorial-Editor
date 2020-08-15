/* eslint-disable */

// Adapted from `codemirror/addon/hint/javascript-hint.js`

(function (mod) {
  if (typeof exports == 'object' && typeof module == 'object')
    // CommonJS
    mod(require('codemirror/lib/codemirror'));
  else if (typeof define == 'function' && define.amd)
    // AMD
    define(['codemirror/lib/codemirror'], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  var Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
  }

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) != -1;
  }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(),
      token = getToken(editor, cur);
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    var innerMode = CodeMirror.innerMode(editor.getMode(), token.state);

    if (innerMode.mode.helperType === 'json') return;
    token.state = innerMode.state;

    var context;
    return {
      list: getCompletions(token, context, keywords, options),
      from: Pos(cur.line, token.start),
      to: Pos(cur.line, token.end),
    };
  }

  function netlogoHint(editor, options) {
    return scriptHint(
      editor,
      netlogoKeywords,
      function (e, cur) {
        return e.getTokenAt(cur);
      },
      options,
    );
  }
  CodeMirror.registerHelper('hint', 'netlogo', netlogoHint);

  var netlogoKeywords = window.keywords.all
    .filter((word) => !window.keywords.unsupported.includes(word))
    .map((word) => word.replace('\\', ''));

  function getCompletions(token, context, keywords, options) {
    var found = [],
      start = token.string,
      global = (options && options.globalScope) || window;

    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) == 0 && !arrayContains(found, str))
        found.push(str);
    }

    forEach(keywords, maybeAdd);
    return found;
  }
});

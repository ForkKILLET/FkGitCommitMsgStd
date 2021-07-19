function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("util"),
    format = _require.format;

var L = function L() {
  var _console;

  return (_console = console).log.apply(_console, arguments);
};

L.o = function () {
  return process.stdout.write(format.apply(void 0, arguments));
};

L.c = function (s) {
  return S.debug && L.o("\x1B[36m".concat(s, "\x1B[0m"));
};

var S = {
  debug: false,
  debugIndent: 2,
  itemOp: "-x*!^$".split(""),
  itemTy: "-?#<>@".split(""),
  infoTy: ":!&".split(""),
  _: {
    n: "root",
    l: -1
  },
  T: function T(N) {
    var _S$checker$N$n, _S$checker;

    N.l = S._.l + 1;
    if (N.d === "~") N.d = N.n;

    if (S.debug) {
      S.debugCoded = false;
      L.o("\n🚩 " + " ".repeat(S.debugIndent * N.l));
      L.c(S._.l + " ");
      L.o("".concat(N.n, " (").concat(N.d, ")  "));
    }

    N.f = S._;
    S._ = N;

    for (var _len = arguments.length, P = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      P[_key - 1] = arguments[_key];
    }

    var R = C[N.n].apply(C, P);
    (_S$checker$N$n = (_S$checker = S.checker)[N.n]) === null || _S$checker$N$n === void 0 ? void 0 : _S$checker$N$n.call(_S$checker, S._);
    S._ = S._.f;
    return R;
  },
  recc: function recc(s) {
    L.c(JSON.stringify(s) + "  ");
    return S._.c = s;
  },
  lnc: function lnc() {
    return S.recc(S.lns.splice(0, 1)[0]);
  },

  get lnh() {
    return S.lns[0];
  },

  set lnh(s) {
    S.lns[0] = s;
  },

  tk: function tk(ln) {
    S.tks = ln.split(" ");
  },
  tkc: function tkc() {
    return S.recc(S.tks.splice(0, 1)[0]);
  },

  get tkh() {
    return S.tks[0];
  },

  chc: function chc() {
    var _ref;

    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var _s = arguments.length > 1 ? arguments[1] : undefined;

    return S.recc((_ref = [S.lnh.slice(0, n), S.lnh.slice(n)], _s = _ref[0], S.lnh = _ref[1], _ref)[0]);
  }
};
var C = {
  none: function none() {},
  lnBrk: function lnBrk(_) {
    if (S.lnh !== "" && !_) throw "should be empty";else S.lnc();
  },
  space: function space() {
    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (n === "auto") {
      var l = S.lnh.length;
      S.lnh = S.lnh.replace(/^ */, "");
      return l - S.lnh.length;
    } else if (S.chc(n) !== " ".repeat(n)) throw "should be ".concat(n, " space(s)");
  },
  url: function url() {
    if (!S.lnc().match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) throw "should be a URL with http or https protocol";
  },
  root: function root() {
    if (S.debug) {
      L.c(S.msg + "\n");
    }

    [{
      n: "header",
      d: "~"
    }, {
      n: "lnBrk",
      d: "line break between header and body"
    }, {
      n: "body",
      d: "~"
    }].forEach(S.T);
  },
  header: function header() {
    S.tk(S.lnc());
    var desc = false;

    while (S.tks.length) {
      if (S.T({
        n: "descSym",
        d: "descriptor symbol in the header"
      }) !== false) desc = true;
    }

    if (!desc) throw "should have at least one descriptor symbol";
  },
  descSym: function descSym() {
    var N = {
      VER: {
        n: "ver",
        d: "version"
      },
      SUM: {
        n: "none",
        d: "~"
      },
      MRG: {
        n: "sharpId",
        d: "id of the commit to merge"
      },
      ISS: {
        n: "sharpId",
        d: "id of the issue to fix"
      }
    }[S.tkc()];
    return N ? S.T(N) : false;
  },
  sharpId: function sharpId() {
    var _S$tkc;

    if (!((_S$tkc = S.tkc()) !== null && _S$tkc !== void 0 && _S$tkc.match(/^#\d+$/))) throw "should be '#' followed by a number";
  },
  ver: function ver() {
    var _S$tkc2;

    if (!((_S$tkc2 = S.tkc()) !== null && _S$tkc2 !== void 0 && _S$tkc2.match(/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/))) throw "should be a SemVer";
  },
  body: function body() {
    while (S.lns.length) {
      S.T({
        n: "item",
        d: "~"
      }, 0);
      S.T({
        n: "lnBrk",
        d: "optional line break between items"
      }, true);
    }
  },
  item: function item(l) {
    S.T({
      n: "itemOp",
      d: "operation of the item"
    });
    S.T({
      n: "itemTy",
      d: "type of the item"
    });
    S.T({
      n: "space",
      d: "space after type of the item"
    }, 1);
    S.T({
      n: "none",
      d: "summary of the item"
    });
    S.lnc();
    var subItem = false;

    sub: while (S.lns.length && true) {
      var b = S.T({
        n: "space",
        d: "indent of the item"
      }, "auto");
      if ((b -= l * 3) < 0) break;

      switch (b) {
        case 0:
          break sub;

        case 1:
          if (subItem) throw "should be before subitems";
          S.T({
            n: "info",
            d: "inforamtion of the item"
          });
          break;

        case 3:
          S.T({
            n: "item",
            d: "subitem"
          }, l + 1);
          subItem = true;
          break;

        default:
          throw "should be inforamtion or subitem, which should be indented by 1 and 3 spaces respectively";
      }
    }
  },
  itemOp: function itemOp() {
    if (!S.itemOp.includes(S.chc())) throw "should be an operation in [".concat(S.itemOp.join(", "), "]");
  },
  itemTy: function itemTy() {
    var c = S.chc();
    if (!S.itemTy.includes(c)) throw "should be an type in [".concat(S.itemTy.join(", "), "]");
  },
  info: function info() {
    var c = S.T({
      n: "infoTy",
      d: "type of inforamtion"
    });
    S.T({
      n: "space",
      d: "space after inforamtion"
    }, 1);

    switch (c) {
      case "&":
        S.T({
          n: "url",
          d: "url of '&' inforamtion"
        });
        break;

      default:
        S.T({
          n: "none",
          d: "text of inforamtion"
        });
        S.lnc();
    }
  },
  infoTy: function infoTy() {
    var c = S.chc();
    if (!S.infoTy.includes(c)) throw "should be an type in [".concat(S.infoTy.join(", "), "]");
    return c;
  }
};

var I = function I(msgs, args) {
  for (var _i = 0, _Object$entries = Object.entries(args); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        k = _Object$entries$_i[0],
        v = _Object$entries$_i[1];

    S[k] = typeof v == "function" ? v(S[k]) : v;
  }

  if (S.debug) L("🔎 Debugging is on");
  var fail = 0;
  msgs.forEach(function (msg, i) {
    S.msg = msg;
    S.lns = msg.split("\n");

    try {
      S.T({
        n: "root",
        d: "whole message"
      });
    } catch (e) {
      L((S.debug ? "\n" : "") + "\uD83D\uDCA5 Error at meesage ".concat(i, "#, ").concat(S._.n, " (").concat(S._.d, "): ").concat(e, "!"));
      fail++;
    }
  });
  L((fail ? "\uD83D\uDE05 Only ".concat(msgs.length - fail) : (S.debug ? "\n\n" : "") + "🌟 All") + " of ".concat(msgs.length, " commit msg(s) are OK."));
  return fail;
};

module.exports = {
  S: S,
  C: C,
  I: I
};

if (process.env.INPUT_MSGS) {
  //const A = require("../.gitmsgrc.js")
  //const M = JSON.parse(process.env.INPUT_MSGS)
  //const F = I(M, A)
  //process.exit(F)
  child_process.exec("ls", function (_, d) {
    return console.log(d);
  });
}


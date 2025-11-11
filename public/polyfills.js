// Object.assign polyfill
if (typeof Object.assign !== "function") {
  Object.assign = (target) => {
    if (target === null || target === undefined) {
      throw new TypeError("Cannot convert undefined or null to object")
    }
    var to = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index]
      if (nextSource !== null && nextSource !== undefined) {
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
    }
    return to
  }
}

// Array.prototype.find polyfill
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError("Array.prototype.find called on null or undefined")
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function")
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}

// Array.prototype.filter polyfill (eğer eksikse)
if (!Array.prototype.filter) {
  Array.prototype.filter = function (func, thisArg) {
    if (!((typeof func === "Function" || typeof func === "function") && this)) {
      throw new TypeError()
    }
    var len = this.length >>> 0,
      res = new Array(len),
      c = 0,
      i = -1

    if (thisArg === undefined) {
      while (++i !== len) {
        if (i in this) {
          if (func(this[i], i, this)) {
            res[c++] = this[i]
          }
        }
      }
    } else {
      while (++i !== len) {
        if (i in this) {
          if (func.call(thisArg, this[i], i, this)) {
            res[c++] = this[i]
          }
        }
      }
    }
    res.length = c
    return res
  }
}

// String.prototype.includes polyfill
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== "number") {
      start = 0
    }
    if (start + search.length > this.length) {
      return false
    } else {
      return this.indexOf(search, start) !== -1
    }
  }
}

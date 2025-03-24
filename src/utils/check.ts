/** 判断数据类型 **/
function checkDataType(val: any) {
    return Object.prototype.toString.call(val).slice(8, -1);
  }

  /** 数据检测相关包 **/
  export const CheckUtil = {
    isString(val: any) {
      return checkDataType(val) === "String";
    },

    isNumber(val: any) {
      return checkDataType(val) === "Number";
    },

    isBoolean(val: any) {
      return checkDataType(val) === "Boolean";
    },

    isSymbol(val: any) {
      return checkDataType(val) === "Symbol";
    },

    isUndefined(val: any) {
      return checkDataType(val) === "Undefined";
    },

    isNull(val: any) {
      return checkDataType(val) === "Null";
    },

    isFunction(val: any) {
      return checkDataType(val) === "Function";
    },

    isDate(val: any) {
      return checkDataType(val) === "Date";
    },

    isArray(val: any) {
      return checkDataType(val) === "Array";
    },

    /** 原生对象(非数组、日期等) **/
    isPlainObject(val: any) {
      return checkDataType(val) === "Object";
    },

    /** 对象（包含数组，日期等） **/
    isObject(val: any) {
      return val instanceof Object;
    },

    isFormData(val: any) {
      return checkDataType(val) === "FormData";
    },

    isRegExp(val: any) {
      return checkDataType(val) === "RegExp";
    },

    isError(val: any) {
      return checkDataType(val) === "Error";
    },

    isHTMLDocument(val: any) {
      return checkDataType(val) === "HTMLDocument";
    },

    isPromise(val: any) {
      return (
        this.isDef(val) &&
        typeof val.then === "function" &&
        typeof val.catch === "function"
      );
    },

    /** 是否浏览器环境 **/
    isBrowser() {
      return typeof window !== "undefined";
    },

    /** 是否 Node 环境 **/
    isNode() {
      return typeof global !== "undefined";
    },

    /** 是否简单类型（undefined, null, string, number, boolean） **/
    isSimple(val: any) {
      return (
        this.isUndefined(val) ||
        this.isNull(val) ||
        this.isString(val) ||
        this.isNumber(val) ||
        this.isBoolean(val)
      );
    },

    isUndef(val: any) {
      return val === undefined || val === null;
    },

    isDef(val: any) {
      return !this.isUndef(val);
    },

    /** 是否是纯数值字符串，注意 0 **/
    isNumberString(val: any) {
      const n = Number(val);
      return this.isString(val) && (n === 0 || !!n);
    },

    /** 是否是日期格式字符串 **/
    isDateString(val: any) {
      return this.isString(val) && !isNaN(Date.parse(val));
    },

    /** 是否是空字符串 **/
    isEmptyString(val: any) {
      return this.isString(val) && val.length === 0;
    },

    /** 是否是非空字符串（纯空格字符串视为空字符串） **/
    isNotEmptyString(val: any) {
      return this.isString(val) && val.trim().length > 0;
    },

    /** 是否是纯数值字符串或数值 **/
    isLikeNumber(val: any) {
      return this.isNumberString(val) || this.isNumber(val);
    },

    isInt(num: any) {
      return this.isNumber(num) && num === Math.floor(num);
    },

    isFloat(num: any) {
      return this.isNumber(num) && num !== Math.floor(num);
    },

    /** 是否是空数组 **/
    isEmptyArray(val: any) {
      return this.isArray(val) && val.length === 0;
    },

    /** 是否非空数组 **/
    isNotEmptyArray(val: any) {
      return this.isArray(val) && val.length > 0;
    },

    /** 是否只包含简单类型的数组 **/
    isSimpleArray(val: any) {
      return this.isArray(val) && val.every((item: any) => this.isSimple(item));
    },

    /** 是否只包含对象（null不算）的数组 **/
    isObjectArray(val: any) {
      return this.isArray(val) && val.every((item: any) => this.isPlainObject(item));
    },

    /** 是否是空对象 **/
    isEmptyObject(val: any) {
      return this.isPlainObject(val) && Object.keys(val).length === 0;
    },

    /** 是否是空对象 **/
    isNotEmptyObject(val: any) {
      return this.isPlainObject(val) && Object.keys(val).length > 0;
    },

    /** 是否值只包含简单类型对象 **/
    isSimplePlainObject(val: any) {
      return (
        this.isPlainObject(val) &&
        Object.keys(val).every((key: any) => this.isSimple(val[key]))
      );
    },

    /**
     * 是否空数据
     *    undefined, null,{},[],"",undefined => true; 其他返回 false
     * @param val
     * @returns {boolean}
     */
    isEmpty(val: any) {
      return (
        this.isUndefined(val) ||
        this.isNull(val) ||
        this.isEmptyString(val) ||
        this.isEmptyArray(val) ||
        this.isEmptyObject(val)
      );
    },

    /**
     * 是否非空
     * @param val
     * @returns {boolean}
     */
    isNotEmpty(val:any) {
      return !this.isEmpty(val);
    },

    /**
     * 判断两个值是否相等(来自 vue.js)
     * @param a
     * @param b
     * @returns {boolean}
     */
    isEqual(a: any, b: any) {
      if (this.isSimple(a) && this.isSimple(b)) {
        return a === b;
      }

      if (this.isObject(a) && this.isObject(b)) {
        if (this.isArray(a) && this.isArray(b)) {
          return (
            a.length === b.length &&
            a.every((item: any, index: any) => this.isEqual(item, b[index]))
          );
        } else if (this.isDate(a) && this.isDate(b)) {
          return a.getTime() === b.getTime();
        } else if (this.isPlainObject(a) && this.isPlainObject(b)) {
          const keyAList = Object.keys(a);
          const keyBList = Object.keys(b);
          return (
            keyAList.length === keyBList.length &&
            keyAList.every((key: any) => this.isEqual(a[key], b[key]))
          );
        } else {
          return false;
        }
      }

      if (!this.isObject(a) && !this.isObject(b)) {
        return String(a) === String(b);
      }

      return false;
    },
  };

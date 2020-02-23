const defaultTypeMap = {
  b: { type: 'binary', unitOrder: 0, name: 'bit' },
  B: { type: 'binary', unitOrder: 0, name: 'byte' },
  kb: { type: 'decimal', unitOrder: 1, name: 'kilobit' },
  kB: { type: 'decimal', unitOrder: 1, name: 'kilobyte' },
  Kib: { type: 'binary', unitOrder: 1, name: 'kibibit' },
  KiB: { type: 'binary', unitOrder: 1, name: 'kibibyte' },
  Mb: { type: 'decimal', unitOrder: 2, name: 'megabit' },
  MB: { type: 'decimal', unitOrder: 2, name: 'megabyte' },
  Mib: { type: 'binary', unitOrder: 2, name: 'mebibit' },
  MiB: { type: 'binary', unitOrder: 2, name: 'mebibyte' },
  Gb: { type: 'decimal', unitOrder: 3, name: 'gigabit' },
  GB: { type: 'decimal', unitOrder: 3, name: 'gigabyte' },
  Gib: { type: 'binary', unitOrder: 3, name: 'gibibit' },
  GiB: { type: 'binary', unitOrder: 3, name: 'gibibyte' },
  Tb: { type: 'decimal', unitOrder: 4, name: 'terabit' },
  TB: { type: 'decimal', unitOrder: 4, name: 'terabyte' },
  Tib: { type: 'binary', unitOrder: 4, name: 'tebibit' },
  TiB: { type: 'binary', unitOrder: 4, name: 'tebibyte' },
  Pb: { type: 'decimal', unitOrder: 5, name: 'petabit' },
  PB: { type: 'decimal', unitOrder: 5, name: 'petabyte' },
  Pib: { type: 'binary', unitOrder: 5, name: 'pebibit' },
  PiB: { type: 'binary', unitOrder: 5, name: 'pebibyte' },
  Eb: { type: 'decimal', unitOrder: 6, name: 'exabyte' },
  EB: { type: 'decimal', unitOrder: 6, name: 'exabit' },
  Eib: { type: 'binary', unitOrder: 6, name: 'exbibit' },
  EiB: { type: 'binary', unitOrder: 6, name: 'exbibyte' },
  Zb: { type: 'decimal', unitOrder: 7, name: 'zettabit' },
  ZB: { type: 'decimal', unitOrder: 7, name: 'zettabyte' },
  Zib: { type: 'binary', unitOrder: 7, name: 'zebibit' },
  ZiB: { type: 'binary', unitOrder: 7, name: 'zebibyte' },
  Yb: { type: 'decimal', unitOrder: 8, name: 'yottabit' },
  YB: { type: 'decimal', unitOrder: 8, name: 'yottabyte' },
  Yib: { type: 'binary', unitOrder: 8, name: 'yobibit' },
  YiB: { type: 'binary', unitOrder: 8, name: 'yobibyte' }
};

const defaultUnit = {
  decimal: 1000,
  binary: 1024
};

const defaultAutoScaleOptions = {
  preferByte: false,
  preferBit: false,
  preferBinary: false,
  preferDecimal: false,
  preferSameBase: true,
  preferOppositeBase: false,
  preferSameUnit: true,
  preferOppositeUnit: false,
  handler: (curDataFormat, isUppingDataFormat) => { return true }
};

function isNumber (value) {
  if ((undefined === value) || (value === null)) {
    return false
  }
  if (typeof value === 'number') {
    return true
  }
  return !isNaN(value - 0)
}

class ByteConverter {
  constructor (options = { logs: false }) {
    this.logs = !!options.logs;
    this.__compiledTypeMap = Object.assign({}, defaultTypeMap);
    for (const dataFormat of Object.keys(this.__compiledTypeMap)) {
      this.__compiledTypeMap[dataFormat].asBaseValue = Math.pow(defaultUnit[this.__compiledTypeMap[dataFormat].type], this.__compiledTypeMap[dataFormat].unitOrder);
      this.__compiledTypeMap[dataFormat].dataFormat = dataFormat;
    }
  }

  get typeMap () {
    return Object.assign({}, this.__compiledTypeMap)
  }

  get typeList () {
    const arr = [];
    for (const unit of Object.keys(this.typeMap)) {
      arr.push({ ...this.typeMap[unit] });
    }
    arr.sort(
      (a, b) => {
        this.log('a:', a, 'b:', b);
        return this.compareTo(a.dataFormat, b.dataFormat)
      }
    );
    return arr
  }

  get defaultAutoScaleOptions () {
    return Object.assign({}, defaultAutoScaleOptions)
  }

  convert (value, from, to) {
    if (isNumber(value)) {
      if (this.typeMap[from]) {
        if (this.typeMap[to]) {
          const fromIsByte = this.isByte(from);
          const toIsByte = this.isByte(to);
          let asBaseValue = -1;
          if ((fromIsByte && toIsByte) || (!fromIsByte && !toIsByte)) {
            asBaseValue = value * this.typeMap[from].asBaseValue; //  the value in bit or byte * the value of his dataFormat in bit or byte
          } else if (fromIsByte && !toIsByte) {
            asBaseValue = value * this.typeMap[from].asBaseValue * 8; //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
          } else if (!fromIsByte && toIsByte) {
            asBaseValue = value * this.typeMap[from].asBaseValue / 8;//  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
          }
          return asBaseValue / this.typeMap[to].asBaseValue // the value in bit or byte (depend in from e to dataFormat) / the value of the to data format in bit or byte
        } else { throw new Error('"to" paramater isn\'t a valid dataFormat') }
      } else { throw new Error('"from" paramater isn\'t a valid dataFormat') }
    } else { throw new Error('"value" paramater isn\'t a valid number') }
  }

  autoScale (value, dataFormat, options) {
    if (!isNumber(value)) { throw new Error('"value" paramater isn\'t a valid number') }
    dataFormat = this.getDataFormat(dataFormat);
    options = options || this.defaultAutoScaleOptions;
    for (const defaultOption of Object.keys(this.defaultAutoScaleOptions)) {
      if (!(options[defaultOption] === true || options[defaultOption] === false) && defaultOption !== 'handler') {
        options[defaultOption] = false;
      }
      if (defaultOption === 'handler' && !(options[defaultOption] && typeof options[defaultOption] === 'function')) {
        options[defaultOption] = defaultAutoScaleOptions[defaultOption];
      }
    }
    const retVal = { value, dataFormat: dataFormat.dataFormat };
    const scale = (filteredList) => {
      this.log('scale int fn called:', filteredList);
      for (let i = 0; i < filteredList.length; i++) {
        const newVal = this.convert(value, dataFormat.dataFormat, filteredList[i].dataFormat);
        this.log('newVal:', newVal, 'newDataFormat:', filteredList[i].dataFormat);
        if ((newVal < 1000 && newVal >= 1) || i === filteredList.length - 1) {
          return { value: newVal, dataFormat: filteredList[i].dataFormat }
        }
      }
      return retVal
    };
    const filterList = (curDataFormat, isUppingDataFormat) => {
      let retVal = true;
      this.log(options);
      if (options.preferSameBase && !(options.preferBinary || options.preferDecimal || options.preferOppositeBase)) {
        this.log('isUppingDataFormat:', isUppingDataFormat);
        this.log('isBaseDataFormat(curDataFormat.dataFormat):', this.isBaseDataFormat(curDataFormat.dataFormat));
        this.log('isBaseDataFormat(dataFormat.dataFormat):', this.isBaseDataFormat(dataFormat.dataFormat));
        this.log('isDecimal(dataFormat.dataFormat):', this.isDecimal(dataFormat.dataFormat));
        this.log('isDecimal(curDataFormat.dataFormat)', this.isDecimal(curDataFormat.dataFormat));
        this.log('isBinary(dataFormat.dataFormat)', this.isBinary(dataFormat.dataFormat));
        this.log('isBinary(curDataFormat.dataFormat)', this.isBinary(curDataFormat.dataFormat));

        if (
          !(this.isBaseDataFormat(curDataFormat.dataFormat) && !isUppingDataFormat) && (
            this.isDecimal(dataFormat.dataFormat) !== this.isDecimal(curDataFormat.dataFormat) ||
              this.isBinary(dataFormat.dataFormat) !== this.isBinary(curDataFormat.dataFormat)
          )
        ) {
          this.log('preferSameBase');
          retVal = false;
        }
      }
      if (options.preferSameUnit && !(options.preferByte || options.preferBit || options.preferOppositeUnit)) {
        if (this.isByte(dataFormat.dataFormat) !== this.isByte(curDataFormat.dataFormat) ||
            this.isBit(dataFormat.dataFormat) !== this.isBit(curDataFormat.dataFormat)
        ) {
          this.log('preferSameUnit');
          retVal = false;
        }
      }
      if (options.preferOppositeBase && !(options.preferBinary || options.preferDecimal || options.preferSameBase)) {
        if (
          !(this.isBaseDataFormat(curDataFormat.dataFormat) && !isUppingDataFormat) && (
            this.isDecimal(dataFormat.dataFormat) === this.isDecimal(curDataFormat.dataFormat) ||
              this.isBinary(dataFormat.dataFormat) === this.isBinary(curDataFormat.dataFormat)
          )
        ) {
          this.log('preferOppositeBase');
          retVal = false;
        }
      }
      if (options.preferOppositeUnit && !(options.preferByte || options.preferBit || options.preferSameUnit)) {
        if (this.isByte(dataFormat.dataFormat) === this.isByte(curDataFormat.dataFormat) ||
            this.isBit(dataFormat.dataFormat) === this.isBit(curDataFormat.dataFormat)
        ) {
          this.log('preferOppositeUnit');
          retVal = false;
        }
      }
      if (!options.preferSameBase && !options.preferOppositeBase && options.preferBinary && !options.preferDecimal) {
        if (this.isDecimal(curDataFormat.dataFormat)) {
          this.log('preferBinary');
          retVal = false;
        }
      }
      if (!options.preferSameBase && !options.preferOppositeBase && !options.preferBinary && options.preferDecimal) {
        if (this.isBinary(curDataFormat.dataFormat)) {
          this.log('preferDecimal');
          retVal = false;
        }
      }
      if (!options.preferSameUnit && !options.preferOppositeUnit && options.preferByte && !options.preferBit) {
        if (this.isBit(curDataFormat.dataFormat)) {
          this.log('preferByte');
          retVal = false;
        }
      }
      if (!options.preferSameUnit && !options.preferOppositeUnit && !options.preferByte && options.preferBit) {
        if (this.isByte(curDataFormat.dataFormat)) {
          this.log('preferBit');
          retVal = false;
        }
      }
      return retVal
    };
    if (value >= defaultUnit[dataFormat.type]) {
      this.log('value bigger or equals to ', defaultUnit[dataFormat.type], ' that is the defaultUnit of original value dataFormat type (', dataFormat.type, ')');
      const filteredList = this.typeList.filter((curDataFormat) => {
        const compare = this.compareTo(dataFormat.dataFormat, curDataFormat.dataFormat);
        const filter = (compare < 0 ? filterList(curDataFormat, true) : true);
        const handler = options.handler(curDataFormat, true);
        this.log('curDataFormat:', curDataFormat, 'compareTo:', compare, 'filter:', filter, 'handler:', handler);
        return compare < 0 && filter && handler
      });
      return scale(filteredList)
    } else if (value < 1) {
      this.log('value less then 1');
      const filteredList = this.typeList.filter((curDataFormat) => {
        const compare = this.compareTo(dataFormat.dataFormat, curDataFormat.dataFormat);
        const filter = (compare > 0 ? filterList(curDataFormat, false) : true);
        const handler = options.handler(curDataFormat, false);
        this.log('curDataFormat:', curDataFormat, 'compareTo:', compare, 'filter:', filter, 'handler:', handler);
        return compare > 0 && filter && handler
      });
      filteredList.sort((a, b) => { return this.compareTo(a.dataFormat, b.dataFormat, true) });
      return scale(filteredList)
    }
    return retVal
  }

  log (...args) {
    if (this.logs) { console.log(...args); }
  }

  isByte (dataFormat) {
    if (this.typeMap[dataFormat]) {
      const character = dataFormat[dataFormat.length - 1];
      return character === character.toUpperCase()
    } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
  }

  isBit (dataFormat) {
    if (this.typeMap[dataFormat]) {
      const character = dataFormat[dataFormat.length - 1];
      return character === character.toLowerCase()
    } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
  }

  isBinary (dataFormat) {
    if (this.typeMap[dataFormat]) {
      return this.typeMap[dataFormat].type === 'binary'
    } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
  }

  isDecimal (dataFormat) {
    if (this.typeMap[dataFormat]) {
      return this.typeMap[dataFormat].type === 'decimal'
    } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
  }

  isBaseDataFormat (dataFormat) {
    if (this.typeMap[dataFormat]) {
      return dataFormat.toLowerCase() === 'b'
    } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
  }

  getDataFormat (dataFormat) {
    if (this.typeMap[dataFormat]) {
      return Object.assign({}, this.typeMap[dataFormat])
    } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
  }

  compareValue (value1, dataFormat1, value2, dataFormat2, isDescendent) {
    isDescendent = (isDescendent ? !!isDescendent : false);
    const val = (value, dataformat) => {
      if (dataformat === 'b' || dataFormat1 === dataFormat2) {
        return value
      } else {
        return this.convert(value, dataformat, 'b')
      }
    };
    if (isNumber(value1)) {
      if (this.typeMap[dataFormat1]) {
        if (isNumber(value2)) {
          if (this.typeMap[dataFormat2]) {
            const val1 = val(value1, dataFormat1);
            const val2 = val(value2, dataFormat2);
            this.log('isDescendent:', isDescendent);
            this.log('val1:', val1, 'val2:', val2);
            if (val1 < val2) { return (isDescendent ? 1 : -1) }
            if (val1 === val2) { return 0 }
            if (val1 > val2) { return (isDescendent ? -1 : 1) }
          } else { throw new Error('"dataFormat2" paramater isn\'t a valid dataFormat') }
        } else { throw new Error('"value2" paramater isn\'t a valid number') }
      } else { throw new Error('"dataFormat1" paramater isn\'t a valid dataFormat') }
    } else { throw new Error('"value1" paramater isn\'t a valid number') }
  }

  compareTo (dataFormat1, dataFormat2, isDescendent) {
    return this.compareValue(1, dataFormat1, 1, dataFormat2, isDescendent)
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  name: 'VDataFormatAutoConverter',
  props: {
    value: {
      type: Number,
      required: true
    },
    viewDataFormat: {
      type: Boolean,
      default: true
    },
    viewName: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: 'B'
    },
    localize: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      default: 'en'
    },
    minimumFractionDigits: {
      type: Number,
      default: -1
    },
    maximumFractionDigits: {
      type: Number,
      default: -1
    },
    scaleOptions: {
      type: Object,
      default () { return this.$byteConverter.defaultAutoScaleOptions }
    }
  },
  computed: {
    convertedText () {
      if (this.converted.dataFormat === null || this.converted.value === null) { return '' }
      const options = {};
      if (this.minimumFractionDigits >= 0 && this.minimumFractionDigits <= 20) {
        options.minimumFractionDigits = this.minimumFractionDigits;
      }
      if (this.maximumFractionDigits >= 0 && this.maximumFractionDigits <= 20) {
        options.maximumFractionDigits = this.maximumFractionDigits;
      }
      return (this.localize ? this.converted.value.toLocaleString(this.locale, options) : this.converted.value)
    },
    to () {
      if (this.converted.dataFormat !== null) { return this.converted.dataFormat }
      return ''
    },
    toAsName () {
      if (this.converted.dataFormat !== null) { return this.$byteConverter.getDataFormat(this.converted.dataFormat).name }
      return ''
    },
    converted () {
      return this.$byteConverter.autoScale(this.value, this.from, this.scaleOptions)
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "span",
    [
      _vm._t(
        "default",
        [
          _vm._v("\n    " + _vm._s(_vm.convertedText) + "\n    "),
          _vm.viewDataFormat && !_vm.viewName
            ? [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.to + (_vm.speed ? "/s" : "")) +
                    "\n    "
                )
              ]
            : !_vm.viewDataFormat && _vm.viewName
            ? [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.toAsName + (_vm.speed ? "/s" : "")) +
                    "\n    "
                )
              ]
            : _vm.viewDataFormat && _vm.viewName
            ? [
                _vm._v(
                  "\n      " +
                    _vm._s(
                      _vm.toAsName +
                        (_vm.speed ? "/s" : "") +
                        " (" +
                        _vm.to +
                        (_vm.speed ? "/s" : "") +
                        ")"
                    ) +
                    "\n    "
                )
              ]
            : _vm._e()
        ],
        null,
        Object.assign({}, _vm.$props, {
          converted: _vm.converted.value,
          convertedText: _vm.convertedText,
          to: _vm.to,
          toAsName: _vm.toAsName
        })
      )
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-61afc16a_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"v-data-format-auto-converter.vue"}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-61afc16a";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script$1 = {
  name: 'VDataFormatConverter',
  props: {
    value: {
      type: Number,
      required: true
    },
    viewName: {
      type: Boolean
    },
    viewDataFormat: {
      type: Boolean
    },
    speed: {
      type: Boolean
    },
    from: {
      type: String,
      default: 'B'
    },
    to: {
      type: String,
      default: 'MiB'
    },
    localize: {
      type: Boolean
    },
    locale: {
      type: String,
      default: 'en'
    },
    minimumFractionDigits: {
      type: Number,
      default: -1
    },
    maximumFractionDigits: {
      type: Number,
      default: -1
    }
  },
  computed: {
    convertedText () {
      const options = {};
      if (this.minimumFractionDigits >= 0 && this.minimumFractionDigits <= 20) {
        options.minimumFractionDigits = this.minimumFractionDigits;
      }
      if (this.maximumFractionDigits >= 0 && this.maximumFractionDigits <= 20) {
        options.maximumFractionDigits = this.maximumFractionDigits;
      }
      return (this.localize ? this.converted.toLocaleString(this.locale, options) : this.converted.toString())
    },
    converted () {
      return this.$byteConverter.convert(this.value, this.from, this.to)
    },
    toAsName () {
      return this.$byteConverter.getDataFormat(this.to).name
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "span",
    [
      _vm._t(
        "default",
        [
          _vm._v("\n    " + _vm._s(_vm.convertedText) + "\n    "),
          _vm.viewDataFormat && !_vm.viewName
            ? [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.to + (_vm.speed ? "/s" : "")) +
                    "\n    "
                )
              ]
            : !_vm.viewDataFormat && _vm.viewName
            ? [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.toAsName + (_vm.speed ? "/s" : "")) +
                    "\n    "
                )
              ]
            : _vm.viewDataFormat && _vm.viewName
            ? [
                _vm._v(
                  "\n      " +
                    _vm._s(
                      _vm.toAsName +
                        (_vm.speed ? "/s" : "") +
                        " (" +
                        _vm.to +
                        (_vm.speed ? "/s" : "") +
                        ")"
                    ) +
                    "\n    "
                )
              ]
            : _vm._e()
        ],
        null,
        Object.assign({}, _vm.$props, {
          converted: _vm.converted,
          convertedText: _vm.convertedText,
          toAsName: _vm.toAsName
        })
      )
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-261b1d68_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"v-data-format-converter.vue"}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-261b1d68";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

// Declare install function executed by Vue.use()
function install (Vue) {
  if (install.installed) { return }
  install.installed = true;
  const bc = new ByteConverter();
  Vue.prototype.$byteConverter = bc;

  Vue.component('v-data-format-auto-converter', __vue_component__);

  Vue.component('v-data-format-converter', __vue_component__$1);
}

// Create module definition for Vue.use()
const plugin = {
  install,
  name: 'vue-byte-converter'
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

var VDataFormatAutoConverter = __vue_component__;

var VDataFormatConverter = __vue_component__$1;

var ByteConverter$1 = ByteConverter;

export default plugin;
export { ByteConverter$1 as ByteConverter, VDataFormatAutoConverter, VDataFormatConverter };

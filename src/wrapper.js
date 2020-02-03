
import ByteConverterClass from '@wtfcode/byte-converter'
<% for(const name of modules) { %>
<%= "import " + names[name] + "_ from './"+name+".vue'" %>
<% } %>
// Declare install function executed by Vue.use()
function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	const bc = new ByteConverterClass();
	Vue.prototype.$byteConverter = bc;
	<% for(const name of modules) { %>
	<%= "Vue.component('" + name + "', " + names[name] +"_ )" %>
	<% } %>
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

// To allow use as module (npm/webpack/etc.) export component
//i'm lazy so i export all i find like an object... you can use destructiring if you want use individual element
export default plugin
<% for(const name of modules) { %>
<%= "export var " + names[name] + " = " + names[name] + "_" %>
<% } %>

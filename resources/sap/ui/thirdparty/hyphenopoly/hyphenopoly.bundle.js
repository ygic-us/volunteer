"use strict";(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(c,m,d){
/**
   * @license Hyphenopoly.module.js 2.4.0-devel - hyphenation for node
   * ©2018  Mathias Nater, Zürich (mathiasnater at gmail dot com)
   * https://github.com/mnater/Hyphenopoly
   *
   * Released under the MIT license
   * http://mnater.github.io/Hyphenopoly/LICENSE
   */
"use strict";var f=function makeDecoder(){var a=function a(b){var i=0;var e="";while(i<b.length){e+=String.fromCharCode(b[i]);i+=1;}return e;};return a;}();var S=String.fromCharCode(173);function g(){return Object.create(null);}Math.imul=Math.imul||function imul(a,b){var h=a>>>16&0xffff;var l=a&0xffff;var e=b>>>16&0xffff;var i=b&0xffff;return l*i+(h*i+l*e<<16>>>0)|0;};function j(l){var a=0;switch(l){case"nl":a=41;break;case"de":a=75;break;case"nb-no":a=92;break;case"hu":a=207;break;default:a=32;}if(!H.specMems){H.specMems=g();}if(H.wasm){H.specMems[l]=new WebAssembly.Memory({"initial":a,"maximum":256});}else{Math.log2=Math.log2||function polyfillLog2(x){return Math.log(x)*Math.LOG2E;};var b=(2<<Math.floor(Math.log2(a)))*65536;H.specMems[l]=new ArrayBuffer(b);}}function s(a,b){return{"configurable":(b&4)>0,"enumerable":(b&2)>0,"writable":(b&1)>0,"value":a};}var H=g();H.binaries=g();var k=[];function n(a){return new Promise(function(r,b){if(window.fetch){window.fetch(a).then(function(e){if(e.ok){e.arrayBuffer().then(r);}else{b(e.status);}}).catch(function(){b("network failure");});}else{var x=new XMLHttpRequest();x.open('GET',a);x.responseType="arraybuffer";x.onload=function(){if(x.status!==200){return b(x.status);}if(!(x.response instanceof ArrayBuffer)){return b("The response for '"+a+"' is invalid. Expected ArrayBuffer.");}r(new Uint8Array(x.response).buffer);};x.send();}});}function o(){n(H.c.paths.maindir+'hyphenEngine.wasm').then(function(r){H.binaries.hyphenEngine=r;H.events.dispatch("engineLoaded",{"msg":"wasm"});}).catch(function(a){H.events.dispatch("error",{"key":"hyphenEngine","msg":H.c.paths.maindir+"hyphenEngine.wasm not found.\n"+a});});}function p(){var a="hyphenEngine.asm.js";if(!k[a]){var b=document.createElement("script");k[a]=true;b.src=H.c.paths.maindir+a;b.addEventListener("load",function listener(){H.events.dispatch("engineLoaded",{"msg":"asm"});});document.head.appendChild(b);}}function q(l){n(H.c.paths.patterndir+l+".hpb").then(function(r){H.binaries[l]=r;H.events.dispatch("hpbLoaded",{"msg":l});D.push(l);}).catch(function(a){H.events.dispatch("error",{"key":l,"msg":""+H.c.paths.patterndir+l+".hpb not found.\n"+a});});}function t(a){return Math.ceil(a/65536)*65536;}function u(h){var a=new Uint32Array(h).subarray(0,8);var b=a[7];var e=1280;var i=e+b+(4-(e+b)%4);var l=i+a[6]*4;return{"heapSize":Math.max(t(l+576+a[2]+a[3]),32*1024*64),"hpbOffset":l+576,"hpbPatternsOffset":l+576+a[2],"hpbTranslateOffset":l+576+a[1],"hyphenatedWordOffset":l+320,"hyphenPointsOffset":l+256,"leftmin":a[4],"patternsLength":a[3],"patternTrieOffset":i,"rightmin":a[5],"translatedWordOffset":l+128,"valueStoreOffset":e,"wordOffset":l};}function v(e){var a=e.split(", ");var r=g();var l=a.length;var i=0;var b=null;while(i<l){b=a[i].replace(/-/g,"");if(!r[b]){r[b]=a[i];}i+=1;}return r;}function w(l,h,a,b,r,e){a=a.replace(/-/g,"");if(!H.languages){H.languages=g();}if(!H.languages[l]){H.languages[l]=g();}var i=H.languages[l];if(!i.engineReady){i.cache=g();if(H.c.exceptions.global){if(H.c.exceptions[l]){H.c.exceptions[l]+=", "+H.c.exceptions.global;}else{H.c.exceptions[l]=H.c.exceptions.global;}}if(H.c.exceptions[l]){i.exceptions=v(H.c.exceptions[l]);delete H.c.exceptions[l];}else{i.exceptions=g();}i.genRegExp=new RegExp("[\\w"+a+String.fromCharCode(8204)+"-]{"+H.c.minWordLength+",}","gi");i.leftmin=b;i.rightmin=r;i.hyphenateFunction=h;i.engineReady=true;}H.events.dispatch("engineReady",{"msg":l});}function y(b){return{"hpbPatternsOffset":b.hpbPatternsOffset,"hpbTranslateOffset":b.hpbTranslateOffset,"hyphenatedWordOffset":b.hyphenatedWordOffset,"hyphenPointsOffset":b.hyphenPointsOffset,"patternsLength":b.patternsLength,"patternTrieOffset":b.patternTrieOffset,"translatedWordOffset":b.translatedWordOffset,"valueStoreOffset":b.valueStoreOffset,"wordOffset":b.wordOffset};}function z(b,h){var a=H.wasm?b.wasmMemory.buffer:b.heapBuffer;var e=b.wordOffset;var l=b.hyphenatedWordOffset;var r=new Uint16Array(a).subarray(e>>1,(e>>1)+64);var x=b.leftmin;var M=b.rightmin;var N=new Uint16Array(a).subarray(l>>1,(l>>1)+64);return function hyphenate(O,P,Q,R){var i=0;var T=O.length;Q=Q||x;R=R||M;r[0]=T+2;r[1]=95;while(i<T){r[i+2]=O.charCodeAt(i);i+=1;}r[i+2]=95;if(h(Q,R)===1){i=1;O="";while(i<N[0]+1){O+=String.fromCharCode(N[i]);i+=1;}if(P!==S){O=O.replace(new RegExp(S,"g"),P);}}return O;};}function A(l){var b=u(H.binaries[l]);var a;if(H.specMems[l]&&H.specMems[l].buffer.byteLength>=b.heapSize){a=H.specMems[l];}else{a=new WebAssembly.Memory({"initial":b.heapSize/65536,"maximum":256});}var e=new Uint32Array(a.buffer);e.set(new Uint32Array(H.binaries[l]),b.hpbOffset>>2);b.wasmMemory=a;WebAssembly.instantiate(H.binaries.hyphenEngine,{"env":{"memory":b.wasmMemory,"memoryBase":0},"ext":{"hpbPatternsOffset":b.hpbPatternsOffset,"hpbTranslateOffset":b.hpbTranslateOffset,"hyphenatedWordOffset":b.hyphenatedWordOffset,"hyphenPointsOffset":b.hyphenPointsOffset,"patternsLength":b.patternsLength,"patternTrieOffset":b.patternTrieOffset,"translatedWordOffset":b.translatedWordOffset,"valueStoreOffset":b.valueStoreOffset,"wordOffset":b.wordOffset}}).then(function runWasm(r){r.instance.exports.convert();w(l,z(b,r.instance.exports.hyphenate),f(new Uint16Array(a.buffer).subarray(384,640)),b.leftmin,b.rightmin);}).catch(function(h){console.warn(h);});}function B(l){var h=H.binaries[l];var b=u(h);var a=H.specMems[l].byteLength>=b.heapSize?H.specMems[l]:new ArrayBuffer(b.heapSize);var e=new Uint8Array(a);var i=new Uint8Array(h);e.set(i,b.hpbOffset);b.heapBuffer=a;var r=asmHyphenEngine({"Int32Array":window.Int32Array,"Math":Math,"Uint16Array":window.Uint16Array,"Uint8Array":window.Uint8Array},y(b),b.heapBuffer);r.convert();setTimeout(function(){w(l,z(b,r.hyphenate),f(new Uint16Array(a).subarray(384,640)),b.leftmin,b.rightmin);},0);}var C=null;var D=[];function E(l,e){if(l==="*"){if(e==="wasm"){C=A;}else if(e==="asm"){C=B;}D.forEach(function eachHbp(h){C(h);});}else if(C){C(l);}else{D.push(l);}}var F=g();function G(l,a){l.cache=g();function h(e){var r=String.fromCharCode(8203);var x=null;var i=0;var M=null;var N=e;switch(H.c.compound){case"auto":x=e.split("-");M=G(l,a);while(i<x.length){if(x[i].length>=H.c.minWordLength){x[i]=M(x[i]);}i+=1;}N=x.join("-");break;case"all":x=e.split("-");M=G(l,a);while(i<x.length){if(x[i].length>=H.c.minWordLength){x[i]=M(x[i]);}i+=1;}N=x.join("-"+r);break;default:N=e.replace("-","-"+r);}return N;}function b(e){var i=l.cache[e];if(!i){if(l.exceptions[e]){i=l.exceptions[e].replace(/-/g,H.c.hyphen);}else if(e.indexOf("-")===-1){i=l.hyphenateFunction(e,H.c.hyphen,H.c.leftmin,H.c.rightmin);}else{i=h(e);}l.cache[e]=i;}return i;}F[a]=b;return b;}var I=function createOrphanController(){function a(i,l,b,e){var h=H.c.hyphen;if(".\\+*?[^]$(){}=!<>|:-".indexOf(H.c.hyphen)!==-1){h="\\"+H.c.hyphen;}if(H.c.orphanControl===3&&l===" "){l=String.fromCharCode(160);}return l+b.replace(new RegExp(h,"g"),"")+e;}return a;}();function J(l){var a=H.languages[l];var b=F[l]?F[l]:G(a,l);return function hyphenateText(e){if(H.c.normalize){e=e.normalize("NFC");}var h=e.replace(a.genRegExp,b);if(H.c.orphanControl!==1){h=h.replace(/(\u0020*)(\S+)(\s*)$/,I);}return h;};}(function setupEvents(){var a=g();function b(e,l,x){a[e]={"cancellable":x,"default":l,"register":[]};}b("error",function def(e){console.error(e.msg);},true);b("engineLoaded",function def(e){E("*",e.msg);},false);b("hpbLoaded",function def(e){E(e.msg);},false);b("engineReady",null,false);function h(e,l){if(!l){l=g();}l.defaultPrevented=false;l.preventDefault=function preventDefault(){if(a[e].cancellable){l.defaultPrevented=true;}};a[e].register.forEach(function call(x){x(l);});if(!l.defaultPrevented&&a[e].default){a[e].default(l);}}function i(e,l){if(a[e]){a[e].register.push(l);}else{H.events.dispatch("error",{"msg":"unknown Event \""+e+"\" discarded"});}}function r(e,l){if(a[e]){var x=a[e].register.indexOf(l);a[e].register.splice(x,1);}else{H.events.dispatch("error",{"msg":"unknown Event \""+e+"\" discarded"});}}H.events=g();H.events.dispatch=h;H.events.define=b;H.events.addListener=i;H.events.removeListener=r;})();function K(a){var b=Object.create(null,{"compound":s("hyphen",2),"exceptions":s(g(),2),"hyphen":s(S,2),"leftmin":s(0,2),"minWordLength":s(6,2),"normalize":s(false,2),"orphanControl":s(1,2),"paths":s(Object.create(null,{"maindir":s(a.path+"/",2),"patterndir":s(a.path+"/patterns/",2)}),2),"require":s([],2),"rightmin":s(0,2)});var e=Object.create(b);Object.keys(a).forEach(function each(h){Object.defineProperty(e,h,s(a[h],3));});return e;}function L(l){return new Promise(function pro(r,a){H.events.addListener("engineReady",function handler(e){if(e.msg===l){H.events.removeListener("engineReady",handler);r(J(l));}});H.events.addListener("error",function handler(e){e.preventDefault();if(e.key===l||e.key==="hyphenEngine"){a(e.msg);}});});}H.reInitializeLanguage=function reinit(l,a){H.c=K(a);H.languages[l].engineReady=false;F[l]=null;C(l);return L(l);};H.initializeLanguage=function config(a){H.c=K(a);if(H.c.handleEvent){Object.keys(H.c.handleEvent).forEach(function add(b){H.events.addListener(b,H.c.handleEvent[b]);});}H.wasm=window.WebAssembly!=null;if(!C){H.wasm?o():p();}var r=new Map();if(H.c.require.length===0){H.events.dispatch("error",{"msg":"No language has been required. Setup config according to documenation."});}H.c.require.forEach(function each(l){if(D.indexOf(l)==-1){q(l);j(l);r.set(l,L(l));}});return r.size===1?r.get(H.c.require[0]):r;};m.exports=H;},{}],2:[function(r,m,e){var h=r('./hyphenopoly.browser');window.hyphenopoly=h;},{"./hyphenopoly.browser":1}]},{},[2]);

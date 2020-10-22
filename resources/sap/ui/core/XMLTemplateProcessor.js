/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/base/DataType','sap/ui/base/ManagedObject','sap/ui/core/CustomData','./mvc/View','./mvc/EventHandlerResolver','./ExtensionPoint','./StashedControlSupport','sap/ui/base/SyncPromise','sap/base/Log','sap/base/util/ObjectPath','sap/base/util/values','sap/base/assert','sap/base/security/encodeXML','sap/base/util/LoaderExtensions','sap/base/util/JSTokenizer','sap/base/util/isEmptyObject'],function(q,D,M,C,V,E,a,S,b,L,O,v,c,d,f,J,g){"use strict";function h(e,i,N,j,R){var B=M.bindingParser(i,j,true,false,false,false,R);if(B&&typeof B==="object"){return B;}var p=i=B||i;var y=D.getType(e);if(y){if(y instanceof D){p=y.parseValue(i,{context:j,locals:R});if(!y.isValid(p)){L.error("Value '"+i+"' is not valid for type '"+y.getName()+"'.");}}}else{throw new Error("Property "+N+" has unknown type "+e);}return typeof p==="string"?M.bindingParser.escape(p):p;}function l(e){return e.localName||e.baseName||e.nodeName;}var X="http://www.w3.org/1999/xhtml";var k="http://www.w3.org/2000/svg";var m="sap.ui.core";var n="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1";var o="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1";var r="http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1";var I="http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1";var P="http://schemas.sap.com/sapui5/preprocessorextension/";function s(A,e){function i(p,y,z,B){var F,G,H=[];for(F=p.firstChild;F;F=F.nextSibling){G=e(p,y,z,F,false,B);if(G){H.push(G.unwrap());}}return b.resolve(H);}function j(p,y,z,B){var F,G=Promise.resolve(),H=[B];for(F=p.firstChild;F;F=F.nextSibling){G=G.then(e.bind(null,p,y,z,F,false,B));H.push(G);}return Promise.all(H);}return A?j:i;}var t={};t.loadTemplate=function(e,i){var R=e.replace(/\./g,"/")+("."+(i||"view")+".xml");return f.loadResource(R).documentElement;};t.loadTemplatePromise=function(e,i){var R=e.replace(/\./g,"/")+("."+(i||"view")+".xml");return f.loadResource(R,{async:true}).then(function(j){return j.documentElement;});};t.parseViewAttributes=function(e,j,p){var A=j.getMetadata().getAllProperties();for(var i=0;i<e.attributes.length;i++){var y=e.attributes[i];if(y.name==='controllerName'){j._controllerName=y.value;}else if(y.name==='resourceBundleName'){j._resourceBundleName=y.value;}else if(y.name==='resourceBundleUrl'){j._resourceBundleUrl=y.value;}else if(y.name==='resourceBundleLocale'){j._resourceBundleLocale=y.value;}else if(y.name==='resourceBundleAlias'){j._resourceBundleAlias=y.value;}else if(y.name==='class'){j.addStyleClass(y.value);}else if(!p[y.name]&&A[y.name]){p[y.name]=h(A[y.name].type,y.value,y.name,j._oContainingView.oController);}}};t.enrichTemplateIds=function(e,i){t.enrichTemplateIdsPromise(e,i,false);return e;};t.enrichTemplateIdsPromise=function(e,i,A){return x(e,i,true,A).then(function(){return e;});};t.parseTemplate=function(e,i){return t.parseTemplatePromise(e,i,false).unwrap();};t.parseTemplatePromise=function(i,j,A,y){return x(i,j,false,A,y).then(function(){var p=b.resolve();var z=arguments;if(j.isA("sap.ui.core.mvc.View")&&j._epInfo&&j._epInfo.all.length>0){p=T(A,j,{"content":j._epInfo.all});}return p.then(function(){if(Array.isArray(z[0])){z[0]=z[0].filter(function(e){return!e._isExtensionPoint;});}return z[0];});});};function u(R){var e,i=/^[a-zA-Z_$][a-zA-Z0-9_$]*$/;if(!R||typeof R!=="object"){e="core:require in XMLView can't be parsed to a valid object";}else{Object.keys(R).some(function(K){if(!i.test(K)){e="core:require in XMLView contains invalid identifier: '"+K+"'";return true;}if(!R[K]||typeof R[K]!=="string"){e="core:require in XMLView contains invalide value '"+R[K]+"'under key '"+K+"'";return true;}});}return e;}function w(j,A){var p=j.getAttributeNS(m,"require"),R,y,z;if(p){try{R=J.parseJS(p);}catch(e){L.error("Require attribute can't be parsed on Node: ",j.nodeName);throw e;}z=u(R);if(z){throw new Error(z+" on Node: "+j.nodeName);}if(!g(R)){y={};if(A){return new Promise(function(B,F){var G=Object.keys(R).reduce(function(i,K){y[K]=sap.ui.require(R[K]);return i&&y[K]!==undefined;},true);if(G){B(y);return;}sap.ui.require(v(R),function(){var H=arguments;Object.keys(R).forEach(function(K,i){y[K]=H[i];});B(y);},F);});}else{Object.keys(R).forEach(function(K){y[K]=sap.ui.requireSync(R[K]);});return b.resolve(y);}}}}function T(A,e,i){var j=b.resolve();if(!g(i)){var y=[];var R;if(A){j=new Promise(function(p){R=p;});}Object.keys(i).forEach(function(z){var B=i[z];B.forEach(function(F){F.targetControl=e;var G=sap.ui.require(F.providerClass);if(G){y.push(G.applyExtensionPoint(F));}else{var p=new Promise(function(H,K){sap.ui.require([F.providerClass],function(N){H(N);},K);}).then(function(H){return H.applyExtensionPoint(F);});y.push(p);}});});if(A){Promise.all(y).then(R);}}return j;}function x(p,y,z,A,B){var R=[],F=w(p,A)||b.resolve();A=A&&y._sProcessingMode==="sequential";L.debug("XML processing mode is "+(A?"sequential":"default"),"","XMLTemplateProcessor");var G=sap.ui.getCore().getConfiguration().getDesignMode();if(G){y._sapui_declarativeSourceInfo={xmlNode:p,xmlRootNode:y._oContainingView===y?p:y._oContainingView._sapui_declarativeSourceInfo.xmlRootNode};}var H=y.sViewName||y._sFragmentName;if(!H){var K=y;var N=0;while(++N<1000&&K&&K!==K._oContainingView){K=K._oContainingView;}H=K.sViewName;}if(y.isSubView()){Z(p,true,false,F);}else{if(p.localName==="View"&&p.namespaceURI!=="sap.ui.core.mvc"){L.warning("XMLView root node must have the 'sap.ui.core.mvc' namespace, not '"+p.namespaceURI+"'"+(H?" (View name: "+H+")":""));}$(p,false,false,F);}var i=0;function Q(){for(;i<R.length;i++){var e=R[i];if(e&&typeof e.then==='function'){return e.then(U).then(Q);}}return R;}function U(e){var j=[i,1].concat(e);Array.prototype.splice.apply(R,j);}return F.then(Q);function W(e){return e;}function Y(e){return y._oContainingView.createId(e);}function Z(p,e,j,f1){if(p.nodeType===1){var g1=l(p);if(p.namespaceURI===X||p.namespaceURI===k){R.push("<"+g1+" ");var h1=false;for(var i=0;i<p.attributes.length;i++){var i1=p.attributes[i];var j1=i1.value;if(i1.name==="id"){h1=true;j1=d1(y,p);}R.push(i1.name+"=\""+d(j1)+"\" ");}if(e===true){R.push("data-sap-ui-preserve"+"=\""+y.getId()+"\" ");if(!h1){R.push("id"+"=\""+y.getId()+"\" ");}}R.push(">");var k1=p;if(window.HTMLTemplateElement&&p instanceof HTMLTemplateElement&&p.content instanceof DocumentFragment){k1=p.content;}$(k1,false,false,f1);R.push("</"+g1+">");}else if(g1==="FragmentDefinition"&&p.namespaceURI===m){$(p,false,true,f1);}else{F=F.then(function(){return b1(p,f1).then(function(n1){for(var i=0;i<n1.length;i++){var o1=n1[i];if(y.getMetadata().hasAggregation("content")){y._epInfo=y._epInfo||{contentControlsCount:0,last:null,all:[]};if(o1._isExtensionPoint){o1.index=y._epInfo.contentControlsCount;o1.targetControl=y;o1.aggregationName="content";if(y._epInfo.last){y._epInfo.last._nextSibling=o1;}y._epInfo.last=o1;y._epInfo.all.push(o1);}else{y._epInfo.contentControlsCount++;y.addAggregation("content",o1);}}else if(y.getMetadata().hasAssociation(("content"))){y.addAssociation("content",o1);}}return n1;});});R.push(F);}}else if(p.nodeType===3&&!j){var l1=p.textContent||p.text,m1=l(p.parentNode);if(l1){if(m1!="style"){l1=d(l1);}R.push(l1);}}}function $(p,e,j,f1){var g1=p.childNodes;for(var i=0;i<g1.length;i++){Z(g1[i],e,j,f1);}}function _(e,j){var f1;var g1=sap.ui.getCore().getLoadedLibraries();q.each(g1,function(k1,l1){if(e===l1.namespace||e===l1.name){f1=l1.name+"."+((l1.tagNames&&l1.tagNames[j])||j);}});f1=f1||e+"."+j;function h1(j1){if(!j1){L.error("Control '"+f1+"' did not return a class definition from sap.ui.define.","","XMLTemplateProcessor");j1=O.get(f1);}if(!j1){L.error("Can't find object class '"+f1+"' for XML-view","","XMLTemplateProcessor");}return j1;}var i1=f1.replace(/\./g,"/");var j1=sap.ui.require(i1);if(!j1){if(A){return new Promise(function(k1,l1){sap.ui.require([i1],function(j1){j1=h1(j1);k1(j1);},l1);});}else{j1=sap.ui.requireSync(i1);j1=h1(j1);}}return j1;}function a1(e,j){if(e.namespaceURI===X||e.namespaceURI===k){var id=e.attributes['id']?e.attributes['id'].textContent||e.attributes['id'].text:null;if(z){return t.enrichTemplateIdsPromise(e,y,A).then(function(){return[];});}else{var f1=function(h1){var i1={id:id?d1(y,e,id):undefined,xmlNode:e,containingView:y._oContainingView,processingMode:y._sProcessingMode};if(y.fnScopedRunWithOwner){return y.fnScopedRunWithOwner(function(){return new h1(i1);});}return new h1(i1);};if(A){return new Promise(function(h1,i1){sap.ui.require(["sap/ui/core/mvc/XMLView"],function(g1){h1([f1(g1)]);},i1);});}else{var g1=sap.ui.requireSync("sap/ui/core/mvc/XMLView");return b.resolve([f1(g1)]);}}}else{return b1(e,j);}}function b1(e,j){if(l(e)==="ExtensionPoint"&&e.namespaceURI===m){if(z){return b.resolve([]);}else{var f1=y instanceof V?y._oContainingView:y;var g1=a._factory.bind(null,f1,e.getAttribute("name"),function(){var i1=b.resolve();var j1=[];var k1=e.childNodes;for(var i=0;i<k1.length;i++){var l1=k1[i];if(l1.nodeType===1){i1=i1.then(a1.bind(null,l1,j));j1.push(i1);}}return b.all(j1).then(function(m1){var n1=[];m1.forEach(function(o1){n1=n1.concat(o1);});return n1;});});return b.resolve(y.fnScopedRunWithOwner?y.fnScopedRunWithOwner(g1):g1());}}else{var h1=_(e.namespaceURI,l(e));if(h1&&typeof h1.then==='function'){return h1.then(function(i1){return c1(e,i1,j);});}else{return c1(e,h1,j);}}}function c1(f1,g1,h1){var ns=f1.namespaceURI,j1={},k1={},l1="",m1=[],n1=null,o1=null;if(!g1){return b.resolve([]);}var p1=g1.getMetadata();var q1=p1.getAllSettings();var r1=w(f1,A);if(r1){h1=b.all([h1,r1]).then(function(e){return Object.assign({},e[0],e[1]);});}h1=h1.then(function(j){if(g(j)){j=null;}if(!z){for(var i=0;i<f1.attributes.length;i++){var i1=f1.attributes[i],w1=i1.name,x1,y1=q1[w1],z1=i1.value;if(w1==="id"){j1[w1]=d1(y,f1,z1);}else if(w1==="class"){l1+=z1;}else if(w1==="viewName"){j1[w1]=z1;}else if(w1==="fragmentName"){j1[w1]=z1;j1['containingView']=y._oContainingView;}else if((w1==="binding"&&!y1)||w1==='objectBindings'){var A1=M.bindingParser(z1,y._oContainingView.oController);if(A1){j1.objectBindings=j1.objectBindings||{};j1.objectBindings[A1.model||undefined]=A1;}}else if(w1==='metadataContexts'){var B1=null;try{B1=t._calculatedModelMapping(z1,y._oContainingView.oController,true);}catch(e){L.error(y+":"+e.message);}if(B1){j1.metadataContexts=B1;if(t._preprocessMetadataContexts){t._preprocessMetadataContexts(g1.getMetadata().getName(),j1,y._oContainingView.oController);}}}else if(w1.indexOf(":")>-1){x1=i1.namespaceURI;if(x1===n){var C1=l(i1);m1.push(new C({key:C1,value:h("any",z1,C1,y._oContainingView.oController)}));}else if(x1===o){o1=z1;}else if(x1&&x1.startsWith(P)){L.debug(y+": XMLView parser ignored preprocessor attribute '"+w1+"' (value: '"+z1+"')");}else if(x1===m||x1===I||w1.startsWith("xmlns:")){}else{if(!n1){n1={};}if(!n1.hasOwnProperty(i1.namespaceURI)){n1[i1.namespaceURI]={};}n1[i1.namespaceURI][l(i1)]=i1.nodeValue;L.debug(y+": XMLView parser encountered unknown attribute '"+w1+"' (value: '"+z1+"') with unknown namespace, stored as sap-ui-custom-settings of customData");}}else if(y1&&y1._iKind===0){j1[w1]=h(y1.type,z1,w1,y._oContainingView.oController,j);}else if(y1&&y1._iKind===1&&y1.altTypes){j1[w1]=h(y1.altTypes[0],z1,w1,y._oContainingView.oController,j);}else if(y1&&y1._iKind===2){var A1=M.bindingParser(z1,y._oContainingView.oController,false,false,false,false,j);if(A1){j1[w1]=A1;}else{L.error(y+": aggregations with cardinality 0..n only allow binding paths as attribute value (wrong value: "+w1+"='"+z1+"')");}}else if(y1&&y1._iKind===3){j1[w1]=Y(z1);}else if(y1&&y1._iKind===4){j1[w1]=z1.split(/[\s,]+/g).filter(W).map(Y);}else if(y1&&y1._iKind===5){var D1=[];E.parse(z1).forEach(function(E1){var F1=E.resolveEventHandler(E1,y._oContainingView.oController,j);if(F1){D1.push(F1);}else{L.warning(y+": event handler function \""+E1+"\" is not a function or does not exist in the controller.");}});if(D1.length){j1[w1]=D1;}}else if(y1&&y1._iKind===-1){if(V.prototype.isPrototypeOf(g1.prototype)&&w1=="async"){j1[w1]=h(y1.type,z1,w1,y._oContainingView.oController,j);}else{L.warning(y+": setting '"+w1+"' for class "+p1.getName()+" (value:'"+z1+"') is not supported");}}else{c(w1==='xmlns',y+": encountered unknown setting '"+w1+"' for class "+p1.getName()+" (value:'"+z1+"')");if(t._supportInfo){t._supportInfo({context:f1,env:{caller:"createRegularControls",error:true,info:"unknown setting '"+w1+"' for class "+p1.getName()}});}}}if(n1){m1.push(new C({key:"sap-ui-custom-settings",value:n1}));}if(m1.length>0){j1.customData=m1;}}return j;});var s1=s(A,t1);function t1(f1,u1,v1,e,i1,h1){var w1,x1;if(e.nodeType===1){if(e.namespaceURI===r){j1[l(e)]=e.querySelector("*");return;}w1=e.namespaceURI===ns&&v1&&v1[l(e)];if(w1){return s1(e,w1,false,h1);}else if(u1){if(!i1&&e.getAttribute("stashed")==="true"&&!z){x1=function(){S.createStashedControl(d1(y,e),{sParentId:j1["id"],sParentAggregationName:u1.name,fnCreate:function(){var j=A;A=false;try{return t1(f1,u1,v1,e,true,h1).unwrap();}finally{A=j;}}});};if(y.fnScopedRunWithOwner){y.fnScopedRunWithOwner(x1);}else{x1();}return;}return a1(e,h1).then(function(z1){for(var j=0;j<z1.length;j++){var A1=z1[j];var B1=u1.name;if(A1._isExtensionPoint){if(!j1[B1]){j1[B1]=[];}var C1=k1[B1];if(!C1){C1=k1[B1]=[];}A1.index=j1[B1].length;A1.aggregationName=B1;var D1=C1[C1.length-1];if(D1){D1._nextSibling=A1;}C1.push(A1);}else if(u1.multiple){if(!j1[B1]){j1[B1]=[];}if(typeof j1[B1].path==="string"){c(!j1[B1].template,"list bindings support only a single template object");j1[B1].template=A1;}else{j1[B1].push(A1);}}else{c(!j1[B1],"multiple aggregates defined for aggregation with cardinality 0..1");j1[B1]=A1;}}return z1;});}else if(l(f1)!=="FragmentDefinition"||f1.namespaceURI!==m){throw new Error("Cannot add direct child without default aggregation defined for control "+p1.getElementName());}}else if(e.nodeType===3){var y1=e.textContent||e.text;if(y1&&y1.trim()){throw new Error("Cannot add text nodes as direct child of an aggregation. For adding text to an aggregation, a surrounding html tag is needed: "+y1.trim());}}}var u1=p1.getDefaultAggregation();var v1=p1.getAllAggregations();return s1(f1,u1,v1,h1).then(function(){var e;var j=b.resolve();if(z&&f1.hasAttribute("id")){e1(y,f1);}else if(!z){if(V.prototype.isPrototypeOf(g1.prototype)&&typeof g1._sType==="string"){var i1=function(){if(g1.getMetadata().isA("sap.ui.core.mvc.XMLView")&&y._sProcessingMode==="sequential"){j1.processingMode="sequential";}return V._legacyCreate(j1,undefined,g1._sType);};if(y.fnScopedRunWithOwner){e=y.fnScopedRunWithOwner(i1);}else{e=i1();}}else{var w1=function(){var y1;if(g1.getMetadata().isA("sap.ui.core.Fragment")&&f1.getAttribute("type")!=="JS"&&y._sProcessingMode==="sequential"){j1.processingMode="sequential";}if(y.fnScopedRunWithOwner){y1=y.fnScopedRunWithOwner(function(){var y1=new g1(j1);return y1;});}else{y1=new g1(j1);}j=T(A,y1,k1);return y1;};if(B&&B.fnRunWithPreprocessor){e=B.fnRunWithPreprocessor(w1);}else{e=w1();}}if(l1&&e.addStyleClass){e.addStyleClass(l1);}}if(!e){e=[];}else if(!Array.isArray(e)){e=[e];}if(t._supportInfo&&e){for(var i=0,x1=e.length;i<x1;i++){var y1=e[i];if(y1&&y1.getId()){var z1=t._supportInfo({context:f1,env:{caller:"createRegularControls",nodeid:f1.getAttribute("id"),controlid:y1.getId()}}),A1=o1?o1+",":"";A1+=z1;t._supportInfo.addSupportInfo(y1.getId(),A1);}}}if(G){e.forEach(function(y1){if(p1.getCompositeAggregationName){var B1=f1.getElementsByTagName(y1.getMetadata().getCompositeAggregationName());for(var i=0;i<B1.length;i++){f1.removeChild(B1[0]);}}y1._sapui_declarativeSourceInfo={xmlNode:f1,xmlRootNode:y._sapui_declarativeSourceInfo.xmlRootNode,fragmentName:p1.getName()==='sap.ui.core.Fragment'?j1['fragmentName']:null};});}return j.then(function(){return e;});});}function d1(y,p,e){if(p.getAttributeNS(I,"id")){return p.getAttribute("id");}else{return Y(e?e:p.getAttribute("id"));}}function e1(y,p){p.setAttribute("id",Y(p.getAttribute("id")));p.setAttributeNS(I,"id",true);}}t._preprocessMetadataContexts=null;t._calculatedModelMapping=function(B,e,A){var j,p={},y=M.bindingParser(B,e);function z(F){if(F.length%2===0){throw new Error("The last entry is no binding");}for(var i=1;i<=F.length;i=i+2){if(typeof F[i-1]=='string'){throw new Error("Binding expected not a string");}if(F[i]){if((typeof F[i]!='string')||(F[i]!=",")){throw new Error("Missing delimiter ','");}}}}if(y){if(!y.formatter){j=y;y={parts:[j]};}else{z(y.formatter.textFragments);}for(var i=0;i<y.parts.length;i++){j=y.parts[i];p[j.model]=p[j.model]||(A?[]:null);if(Array.isArray(p[j.model])){p[j.model].push(j);}else{p[j.model]=j;}}}return p;};return t;},true);

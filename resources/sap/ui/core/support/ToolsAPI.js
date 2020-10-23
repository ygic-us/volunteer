/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/library','sap/ui/Global','sap/ui/core/Core','sap/ui/core/ElementMetadata',"sap/base/util/LoaderExtensions","sap/base/util/UriParameters","jquery.sap.global"],function(l,G,C,E,L,U,q){'use strict';var c=sap.ui.getCore().getConfiguration();function _(){var f=G.versioninfo?G.versioninfo.libraries:undefined;var h=Object.create(null);if(f!==undefined){f.forEach(function(i,j,k){h[i.name]=i.version;});}return h;}function a(){var f=sap.ui.getCore().getLoadedLibraries();var h=Object.create(null);Object.keys(sap.ui.getCore().getLoadedLibraries()).forEach(function(i,j,k){h[i]=f[i].version;});return h;}function g(){var p=U.fromQuery(window.location.search);return Array.from(p.keys()).reduce(function(r,k){r[k]=p.getAll(k);return r;},{});}function b(){return{commonInformation:{version:G.version,buildTime:G.buildinfo.buildtime,lastChange:G.buildinfo.lastchange,jquery:q.fn.jquery,userAgent:navigator.userAgent,applicationHREF:window.location.href,documentTitle:document.title,documentMode:document.documentMode||'',debugMode:q.sap.debug(),statistics:q.sap.statistics()},configurationBootstrap:window['sap-ui-config']||Object.create(null),configurationComputed:{theme:c.getTheme(),language:c.getLanguage(),formatLocale:c.getFormatLocale(),accessibility:c.getAccessibility(),animation:c.getAnimation(),rtl:c.getRTL(),debug:c.getDebug(),inspect:c.getInspect(),originInfo:c.getOriginInfo(),noDuplicateIds:c.getNoDuplicateIds()},libraries:_(),loadedLibraries:a(),loadedModules:L.getAllRequiredModules().sort(),URLParameters:g()};}var d={_createRenderedTreeModel:function(n,r){var f=n;var h=f.firstElementChild;var i=r;var s=i;var j=sap.ui.getCore().byId(f.id);if(f.getAttribute('data-sap-ui')&&j){i.push({id:j.getId(),name:j.getMetadata().getName(),type:'sap-ui-control',content:[]});s=i[i.length-1].content;}else if(f.getAttribute('data-sap-ui-area')){i.push({id:f.id,name:'sap-ui-area',type:'data-sap-ui',content:[]});s=i[i.length-1].content;}while(h){this._createRenderedTreeModel(h,s);h=h.nextElementSibling;}}};var e={_getOwnProperties:function(f){var r=Object.create(null);var h=f.getMetadata().getProperties();r.meta=Object.create(null);r.meta.controlName=f.getMetadata().getName();r.properties=Object.create(null);Object.keys(h).forEach(function(k){r.properties[k]=Object.create(null);r.properties[k].value=f.getProperty(k);r.properties[k].type=h[k].getType().getName?h[k].getType().getName():'';});return r;},_copyInheritedProperties:function(f,i){var h=i.getProperties();var r=Object.create(null);r.meta=Object.create(null);r.meta.controlName=i.getName();r.properties=Object.create(null);Object.keys(h).forEach(function(k){r.properties[k]=Object.create(null);r.properties[k].value=h[k].get(f);r.properties[k].type=h[k].getType().getName?h[k].getType().getName():'';});return r;},_getInheritedProperties:function(f){var r=[];var i=f.getMetadata().getParent();while(i instanceof E){r.push(this._copyInheritedProperties(f,i));i=i.getParent();}return r;},_getProperties:function(f){var h=sap.ui.getCore().byId(f);var p=Object.create(null);if(h){p.own=this._getOwnProperties(h);p.inherited=this._getInheritedProperties(h);}return p;},_getModelFromContext:function(f,h){var j=f.getBinding(h);var k=j.getModel();var m=(f.getBindingInfo(h).parts)?f.getBindingInfo(h).parts:[];var n=[];for(var i=0;i<m.length;i++){n.push(m[i].model);}var o={names:n,path:j.getPath()};if(k){o.mode=k.getDefaultBindingMode();o.type=k.getMetadata().getName();o.data=k.getData?k.getData('/'):undefined;}return o;},_getBindDataForProperties:function(f){var p=f.getMetadata().getAllProperties();var h=Object.create(null);for(var k in p){if(p.hasOwnProperty(k)&&f.getBinding(k)){h[k]=Object.create(null);h[k].path=f.getBinding(k).getPath();h[k].value=f.getBinding(k).getValue();h[k].type=f.getMetadata().getProperty(k).getType().getName?f.getMetadata().getProperty(k).getType().getName():'';h[k].mode=f.getBinding(k).getBindingMode();h[k].model=this._getModelFromContext(f,k);}}return h;},_getBindDataForAggregations:function(f){var h=f.getMetadata().getAllAggregations();var i=Object.create(null);for(var k in h){if(h.hasOwnProperty(k)&&f.getBinding(k)){i[k]=Object.create(null);i[k].model=this._getModelFromContext(f,k);}}return i;}};return{getFrameworkInformation:b,getRenderedControlTree:function(){var r=[];d._createRenderedTreeModel(document.body,r);return r;},getControlProperties:function(f){return e._getProperties(f);},getControlBindings:function(f){var r=Object.create(null);var h=sap.ui.getCore().byId(f);var i;if(!h){return r;}i=h.getBindingContext();r.meta=Object.create(null);r.contextPath=i?i.getPath():null;r.aggregations=e._getBindDataForAggregations(h);r.properties=e._getBindDataForProperties(h);return r;}};});
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./../util/isTemplate","sap/ui/model/json/JSONModel","sap/m/Label","sap/ui/core/Fragment","sap/base/util/restricted/_omit","sap/ui/base/ManagedObjectObserver","sap/ui/integration/designtime/baseEditor/propertyEditor/PropertyEditorFactory","sap/ui/integration/designtime/baseEditor/util/createPromise","sap/base/util/deepClone","sap/base/util/deepEqual","sap/base/util/isPlainObject","sap/base/util/values","sap/base/util/each","sap/ui/integration/designtime/baseEditor/validator/ValidatorRegistry","sap/ui/integration/designtime/baseEditor/util/BaseDefaultValidatorModules","sap/ui/integration/designtime/baseEditor/util/cleanupDesigntimeMetadata"],function(C,i,J,L,F,_,M,P,c,d,a,b,v,e,V,B,f){"use strict";var g=C.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor",{metadata:{interfaces:["sap.ui.core.IFormContent"],properties:{"renderLabel":{type:"boolean",defaultValue:true},"value":{type:"any"},"config":{type:"object"}},aggregations:{"_label":{type:"sap.m.Label",visibility:"hidden",multiple:false},"content":{type:"sap.ui.core.Control",multiple:false}},events:{beforeValueChange:{parameters:{path:{type:"string"},value:{type:"any"},nextValue:{type:"any"}}},valueChange:{parameters:{path:{type:"string"},value:{type:"any"},previousValue:{type:"any"}}},designtimeMetadataChange:{parameters:{path:{type:"string"},value:{type:"any"},previousValue:{type:"any"}}},configChange:{parameters:{previousConfig:{type:"object"},config:{type:"object"}}},fragmentChange:{parameters:{previousFragment:{type:"string"},fragment:{type:"string"}}},ready:{},init:{}}},xmlFragment:null,_currentXmlFragment:null,_bFragmentReady:false,constructor:function(){this._iExpectedWrapperCount=0;this._currentXmlFragment=this.xmlFragment;C.prototype.constructor.apply(this,arguments);this._oDefaultModel=new J({value:this.getValue(),config:this.getConfig(),displayValue:this._formatValue(this.getValue())});this._oDefaultModel.setDefaultBindingMode("OneWay");this.setBindingContext(this._oDefaultModel.getContext("/"));this.setModel(this._oDefaultModel);this.bindProperty("visible","config/visible");this._setReady(false);this._aEditorWrappers=[];this._bInitFinished=false;this.attachBeforeValueChange(function(E){this._iExpectedWrapperCount=this.getExpectedWrapperCount(E.getParameter("nextValue"));},this);this.attachValueChange(function(E){var l=E.getParameter("value");this._oDefaultModel.setData(Object.assign({},this._oDefaultModel.getData(),{value:l,displayValue:this._formatValue(l)}));this._checkReadyState();},this);this.attachConfigChange(function(E){var p=E.getParameter("previousConfig");var o=E.getParameter("config");if(p&&o&&!a(p.validators,o.validators)){this._validate(this.getValue());}this._oDefaultModel.setData(Object.assign({},this._oDefaultModel.getData(),{config:o}));},this);this.asyncInit().then(function(){this._bInitFinished=true;this.fireInit();this._checkReadyState();}.bind(this));if(this.getFragment()){this._initFragment(this.getFragment());}},renderer:function(r,p){r.openStart("div",p);r.addStyle("display","inline-block");r.addStyle("width","100%");r.openEnd();if(p.getRenderLabel()&&p.getLabel()){r.openStart("div");r.openEnd();r.renderControl(p.getLabel());r.close("div");}r.renderControl(p.getContent());r.close("div");}});g.prototype.init=function(){this.attachFragmentChange(function(E){if(this.getContent()){this.getContent().destroy();}var s=E.getParameter("fragment");this._initFragment(s);},this);};g.prototype.asyncInit=function(){return Promise.resolve();};g.prototype.onFragmentReady=function(){};g.prototype.setValue=function(l,s){var m=this.getValue();var o=this.getConfig()||{};var n=l;if(typeof n==="undefined"&&typeof o.defaultValue!=="undefined"){n=d(o.defaultValue);}this._validate(n,function(r){if((r||s)&&!a(n,m)){this.fireBeforeValueChange({path:o.path,value:m,nextValue:n});this.setProperty("value",n);this.fireValueChange({path:o.path,previousValue:m,value:n});}}.bind(this));};g.prototype.setDesigntimeMetadata=function(o){var l=this.getDesigntimeMetadata();var n=o;f(n);var m=this.getConfig();if(!a(l,n)){this.fireDesigntimeMetadataChange({path:m.path,previousValue:l,value:n});}};g.prototype.getDesigntimeMetadata=function(){return(this.getConfig()||{}).designtime||{};};g.prototype.setDesigntimeMetadataValue=function(o){this.setDesigntimeMetadata(Object.assign({},this.getConfig().designtime,{__value:o}));};g.prototype.getNestedDesigntimeMetadata=function(K){var D=(this.getConfig()||{}).designtime||{};return D[K];};g.prototype.getNestedDesigntimeMetadataValue=function(K){return(this.getNestedDesigntimeMetadata(K)||{}).__value||{};};g.prototype.getDesigntimeMetadataValue=function(){var D=(this.getConfig()||{}).designtime||{};return D.__value||{};};g.prototype._getValidators=function(){var p=this.getConfig().validators||{};return v(Object.assign({},p,this.getDefaultValidators())).filter(function(o){return o.isEnabled!==false;});};g.prototype.getDefaultValidators=function(){return{};};g.prototype._validate=function(l,o){var E=[];var m=this._getValidators();m=m.map(function(p){var q=V.hasValidator(p.type)?V.getValidator(p.type):this.getDefaultValidatorModules()[p.type];if(!q){throw new Error("Unknown validator: "+p.type);}var r={};var s=p.errorMessage||q.errorMessage;var t=[];var u=s;if(b(s)){t=s.placeholders(p.config);u=s.message;}Object.keys(p.config||{}).forEach(function(w){var x=p.config[w];if(typeof x==="function"){x=x(this);}r[w]=x;}.bind(this));return{validator:q,config:r,errorMessage:this.getI18nProperty(u,t),type:p.type};}.bind(this));var n=function(){var r=E.length===0;this.setInputState(!r,E[0]);if(typeof o==="function"){o(r);}}.bind(this);m.forEach(function(p){if(!p.validator.validate(l,p.config)){E.push(p.errorMessage);}});n();};g.prototype.setInputState=function(H,E){var I=this.getContent();if(!I||!I.setValueState){return;}if(H){I.setValueState("Error");I.setValueStateText(E);}else{I.setValueState("None");}};g.prototype.getDefaultValidatorModules=function(){return B;};g.prototype._formatValue=function(l){return this.formatValue(d(l));};g.prototype.formatValue=function(l){return l;};g.prototype.getExpectedWrapperCount=function(){return 0;};g.prototype._checkReadyState=function(){if(this._mWrapperReadyCheck){this._mWrapperReadyCheck.cancel();}if(!this._bInitFinished){this._setReady(false);return;}if(!this._bFragmentReady){this._setReady(false);return;}if(this._iExpectedWrapperCount===0){this._setReady(true);return;}if(this._iExpectedWrapperCount===this._aEditorWrappers.length){if(this._aEditorWrappers.every(function(w){return w.isReady();})){this._setReady(true);}else{this._setReady(false);this._mWrapperReadyCheck=c(function(r){Promise.all(this._aEditorWrappers.map(function(w){return w.ready();})).then(r);}.bind(this));this._mWrapperReadyCheck.promise.then(function(){this._setReady(true);delete this._mWrapperReadyCheck;}.bind(this));}}else{this._setReady(false);}};g.prototype.wrapperInit=function(E){if(!this._oWrapperObserver){this._oWrapperObserver=new M(function(m){var o=m.object;switch(m.type){case'destroy':this._aEditorWrappers=this._aEditorWrappers.filter(function(l){return l!==o;});this._checkReadyState();break;case'parent':j(o).forEach(function(w){if(!i(w,this)){this._registerWrapper(w);}}.bind(this));this._oWrapperObserver.unobserve(o);break;default:return;}}.bind(this));}var w=E.getSource();if(i(w,this)){var r=h(w);if(!this._oWrapperObserver.isObserved(r,{parent:true})){this._oWrapperObserver.observe(r,{parent:true});}return;}this._registerWrapper(w);};function h(E){var p=E.getParent();return p?h(p):E;}function j(E){return k(E)?[E]:E.findAggregatedObjects(true,function(E){return k(E);});}function k(E){return E.isA("sap.ui.integration.designtime.baseEditor.PropertyEditors")||E.isA("sap.ui.integration.designtime.baseEditor.PropertyEditor");}g.prototype._registerWrapper=function(w){this._aEditorWrappers.push(w);w.attachReady(function(E){this._setReady(false);this._checkReadyState();}.bind(this));if(w.isA("sap.ui.integration.designtime.baseEditor.PropertyEditor")){w.attachPropertyEditorChange(function(E){var p=E.getParameter("propertyEditor");if(!p){this._setReady(false);}},this);}this._oWrapperObserver.observe(w,{destroy:true});this._checkReadyState();};g.prototype._setReady=function(r){var p=this._bIsReady;this._bIsReady=r;if(p!==true&&r===true){this.fireReady();}};g.prototype.isReady=function(){return!!this._bIsReady;};g.prototype.ready=function(){return new Promise(function(r){if(this.isReady()){r();}else{this.attachEventOnce("ready",r);}}.bind(this));};g.prototype.setFragment=function(s,G){if(this._currentXmlFragment!==s){var p=this._currentXmlFragment;this._currentXmlFragment=s;if(typeof G==='function'){this.getExpectedWrapperCount=G;}this.fireFragmentChange({previousFragment:p,fragment:s});}};g.prototype.getFragment=function(){return this._currentXmlFragment;};g.prototype._initFragment=function(s){this._setReady(false);this._bFragmentReady=false;if(this._fnCancelFragmentLoading){this._fnCancelFragmentLoading();}var o=c(function(r,R){this._loadFragment(s).then(r,R);}.bind(this));this._fnCancelFragmentLoading=o.cancel;return o.promise.then(function(l){delete this._fnCancelFragmentLoading;this._bFragmentReady=true;this.setContent(l);this.onFragmentReady();this._checkReadyState();}.bind(this));};g.prototype._loadFragment=function(s){return F.load({name:s,controller:this});};g.prototype.clone=function(){this.destroyContent();return C.prototype.clone.apply(this,arguments);};g.prototype.exit=function(){this._oDefaultModel.destroy();if(this._oConfigBinding){this._oConfigBinding.destroy();}if(this._oWrapperObserver){this._oWrapperObserver.destroy();}if(this._fnCancelFragmentLoading){this._fnCancelFragmentLoading();}};g.configMetadata={visible:{defaultValue:true,mergeStrategy:"mostRestrictiveWins"}};g.prototype.setConfig=function(o){var p=this.getConfig();var D={};var l=P.getType(this.getMetadata().getName()).configMetadata;e(l,function(s,m){D[s]=m.defaultValue;});var n=Object.assign({},D,o);n=this.onBeforeConfigChange(n);if(!a(p,n)){this.setProperty("config",n);this.fireConfigChange({previousConfig:p,config:n});}};g.prototype.onBeforeConfigChange=function(o){return o;};g.prototype.getI18nProperty=function(n,p){if(this.getModel("i18n")){return this.getModel("i18n").getResourceBundle().getText(n,p);}return n;};g.prototype.getLabel=function(){var l=this.getAggregation("_label");if(!l){l=new L({text:"{config/label}",design:"Bold"});this.setAggregation("_label",l);}return l;};g.prototype.enhanceAccessibilityState=function(E,A){var p=this.getParent();if(p&&p.enhanceAccessibilityState){p.enhanceAccessibilityState(this,A);}return A;};g.prototype.getFocusDomRef=function(){var o=this.getContent();if(o&&o.isA("sap.ui.core.IFormContent")){return o.getFocusDomRef();}};g.prototype.getIdForLabel=function(){var o=this.getContent();if(o&&o.isA("sap.ui.core.IFormContent")){return o.getIdForLabel();}};return g;});
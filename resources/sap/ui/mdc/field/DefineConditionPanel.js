/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/base/ManagedObjectObserver','sap/base/util/merge','sap/base/util/deepEqual','sap/ui/mdc/condition/Condition','sap/ui/mdc/condition/FilterOperatorUtil','sap/ui/mdc/condition/Operator','sap/ui/mdc/enum/EditMode','sap/ui/mdc/enum/FieldDisplay','sap/ui/mdc/enum/BaseType','sap/ui/mdc/enum/ConditionValidated','sap/ui/mdc/Field','sap/ui/mdc/field/ListFieldHelp','sap/ui/model/base/ManagedObjectModel','sap/ui/model/json/JSONModel','sap/ui/model/resource/ResourceModel','sap/ui/model/type/String','sap/ui/core/InvisibleText','sap/ui/core/ListItem','sap/ui/layout/Grid','sap/ui/layout/GridData','sap/m/library','sap/m/ScrollContainer','sap/m/Button'],function(C,M,m,d,a,F,O,E,b,B,c,e,L,f,J,R,S,I,g,G,h,l,j,k){"use strict";var o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");sap.ui.getCore().attachLocalizationChanged(function(){o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");});var n=l.ButtonType;var D=C.extend("sap.ui.mdc.field.DefineConditionPanel",{metadata:{properties:{conditions:{type:"object[]",group:"Data",defaultValue:[],byValue:true},formatOptions:{type:"object",defaultValue:{}}},aggregations:{_content:{type:"sap.ui.core.Control",multiple:false}},events:{}},_oManagedObjectModel:null,renderer:{apiVersion:2,render:function(i,V){i.openStart("section",V);i.class("sapUiMdcDefineConditionPanel");i.openEnd();i.renderControl(V.getAggregation("_content"));i.close("section");}},init:function(){sap.ui.getCore().getMessageManager().registerObject(this,true);C.prototype.init.apply(this,arguments);this._oManagedObjectModel=new f(this);this._oObserver=new M(_.bind(this));this._oObserver.observe(this,{properties:["conditions","formatOptions"]});z.call(this);this.setModel(this._oManagedObjectModel,"$this");this.setModel(this._oManagedObjectModel,"$condition");},exit:function(){sap.ui.getCore().getMessageManager().unregisterObject(this,true);this._oObserver.disconnect();this._oObserver=undefined;if(this._sConditionsTimer){clearTimeout(this._sConditionsTimer);this._sConditionsTimer=null;}if(this._oDefaultType){this._oDefaultType.destroy();delete this._oDefaultType;}this._oManagedObjectModel.destroy();delete this._oManagedObjectModel;},byId:function(i){return sap.ui.getCore().byId(this.getId()+"--"+i);},onBeforeRendering:function(){if(!this.getModel("$i18n")){this.setModel(new R({bundleName:"sap/ui/mdc/messagebundle",async:false}),"$i18n");}if(this.getConditions().length===0){this.updateDefineConditions();}},removeCondition:function(i){var V=i.oSource;var W=V.getBindingContext("$this").getObject();var X=this.getConditions();var Y=F.indexOfCondition(W,X);X.splice(Y,1);this.setProperty("conditions",X,true);},addCondition:function(i){var V=this.getConditions();var W=this.getFormatOptions();var X=W.maxConditions;if(X==-1||V.length<X){this.addDummyCondition(V.length+1);if(this.getConditions().length===X){this._bFocusLastCondition=true;}}},addDummyCondition:function(i){var V=s.call(this);var W=V.indexOf("EQ")>=0?"EQ":V[0];var X=a.createCondition(W,[null],undefined,undefined,c.NotValidated);F.updateConditionValues(X);F.checkConditionsEmpty(X,V);var Y=this.getConditions();if(i!==undefined){Y.splice(i,0,X);}else{Y.push(X);}this.setProperty("conditions",Y,true);},updateDefineConditions:function(){var i=this.getConditions().filter(function(V){return V.validated!==c.Validated;});y.call(this,i,true,false);if(i.length===0){this.addDummyCondition();}},onChange:function(i){var V=s.call(this);var W=this.getConditions();F.checkConditionsEmpty(W,V);F.updateConditionsValues(W,V);this.setProperty("conditions",W,true);},onSelectChange:function(i){var V=i.getSource();var W=V.getValue();var X=V._sOldKey;var Y=F.getOperator(W);var Z=X&&F.getOperator(X);if(Y&&Z){var $;var a1;var b1;var c1=false;if(!d(Y.valueTypes[0],Z.valueTypes[0])&&Y.valueTypes[0]!==O.ValueType.Static){$=V.getBindingContext("$this").getObject();a1=this.getConditions();b1=F.indexOfCondition($,a1);if(b1>=0){$=a1[b1];if($.values.length>0&&$.values[0]!==null){$.values[0]=null;c1=true;}if($.values.length>1&&$.values[1]!==null){$.values[1]=null;c1=true;}}}if(!Y.valueTypes[1]&&Z.valueTypes[1]){if(!$){$=V.getBindingContext("$this").getObject();a1=this.getConditions();b1=F.indexOfCondition($,a1);$=a1[b1];}if(b1>=0){if($.values.length>1&&$.values[1]){$.values=$.values.slice(0,1);c1=true;}}}if(c1){this.setProperty("conditions",a1,true);}}delete V._sOldKey;},onPaste:function(V){var W,X=V.srcControl;if(window.clipboardData){W=window.clipboardData.getData("Text");}else{W=V.originalEvent.clipboardData.getData('text/plain');}var Y=W.split(/\r\n|\r|\n/g);if(Y&&Y.length>1){setTimeout(function(){var Z=s.call(this);var $=u.call(this);var a1=w.call(this,$);var b1=Y.length;var c1=this.getConditions();for(var i=0;i<b1;i++){if(Y[i]){var d1=Y[i];var e1=d1.split(/\t/g);var f1;if(e1.length==2&&e1[0]&&e1[1]){f1=F.getOperator("BT");}else{e1=[d1.trim()];f1=F.getDefaultOperator(a1);}d1=f1?f1.format(a.createCondition(f1.name,e1)):e1[0];if(f1){var g1=f1.getCondition(d1,$,b.Value,true);if(g1){g1.validated=c.NotValidated;F.checkConditionsEmpty(g1,Z);c1.push(g1);}}}}this.setProperty("conditions",c1,true);if(X.setDOMValue){X.setDOMValue("");}}.bind(this),0);}}});function _(i){if(i.name==="value"){p.call(this,i.object,i.current,i.old);}if(i.name==="formatOptions"){var V=this.getConditions();var W=i.current&&i.current.operators;var X=i.old&&i.old.operators;var Y=false;if(!d(W,X)){Y=true;t.call(this);}var Z=i.current&&i.current.valueType&&i.current.valueType.getMetadata().getName();var $=i.old&&i.old.valueType&&i.old.valueType.getMetadata().getName();if(Z!==$&&V.length>0){if(!Y){t.call(this);}this._bUpdateType=true;H.call(this);this._bUpdateType=false;y.call(this,V,true,true);}}if(i.name==="conditions"){if(this._sConditionsTimer){clearTimeout(this._sConditionsTimer);this._sConditionsTimer=null;}this._sConditionsTimer=setTimeout(function(){this._sConditionsTimer=null;this.updateDefineConditions();H.call(this);}.bind(this),0);}}function p(V,W,X){V._sOldKey=X;var Y=0;if(W&&X){var Z=F.getOperator(W);var $=F.getOperator(X);if(Z.valueTypes[0]!==$.valueTypes[0]){var a1=V.getParent();Y=a1.indexOfContent(V);var b1=a1.getContent()[Y+2];if(b1&&b1.hasOwnProperty("_iValueIndex")&&b1._iValueIndex===0){b1.unbindProperty("value");}}}if(!W){var c1=V.getBindingContext("$this").getObject();if(c1){var d1=this.getConditions();Y=F.indexOfCondition(c1,d1);if(Y>=0){c1=d1[Y];c1.operator=X;this.setProperty("conditions",d1,true);}}}var e1=this.oOperatorModel.getData();var f1;for(var i=0;i<e1.length;i++){var g1=e1[i];if(g1===W){f1=g1.additionalText;}}V.setAdditionalValue(f1);this.onChange();}function q(i,V,W,X){var Y=F.getOperator(i.operator);if(!Y){return null;}var Z=r.call(this,Y.name,V);var $=this._oManagedObjectModel.getContext(X.getPath()+"values/"+V+"/");var a1;if(Y.createControl){a1=Y.createControl(Z,Y,"$this>",V);}else{a1=new e(W,{delegate:x.call(this),value:{path:"$this>",type:Z,mode:'TwoWay',targetType:'raw'},editMode:{path:"$condition>operator",formatter:N},width:"100%"});}if(a1.getMetadata().hasProperty("placeholder")){if(V===0){a1.bindProperty("placeholder",{path:"$condition>operator",formatter:T});}else{a1.bindProperty("placeholder",{path:"$i18n>valuehelp.DEFINECONDITIONS_TO"});}}a1._iValueIndex=V;a1.addStyleClass("sapUiSmallPaddingBegin");if(a1.attachChange){a1.attachChange(this.onChange.bind(this));}a1.onpaste=this.onPaste.bind(this);a1.setLayoutData(new h({span:{path:"$condition>operator",formatter:Q}}));a1.setBindingContext($,"$this");a1.setBindingContext(X,"$condition");return a1;}function r(i,V){var W=u.call(this);var X=F.getOperator(i);if(X.valueTypes[V]&&[O.ValueType.Self,O.ValueType.Static].indexOf(X.valueTypes[V])===-1){W=X._createLocalType(X.valueTypes[V]);}var Y=false;if(X.valueTypes[V]===O.ValueType.Static){Y=true;W=v.call(this);}var Z=Y?B.String:w.call(this,W);var $;var a1;var b1;var c1;switch(Z){case B.Boolean:if(W.oConstraints&&W.oConstraints.hasOwnProperty("nullable")&&W.oConstraints.nullable===false){a1=sap.ui.require(W.getMetadata().getName().replace(/\./g,"/"));b1=m({},W.oFormatOptions);c1=m(W.oConstraints,{nullable:true});$=new a1(b1,c1);}else{$=W;}break;case B.Numeric:if(W.oFormatOptions&&W.oFormatOptions.hasOwnProperty("emptyString")&&W.oFormatOptions.emptyString===null){$=W;}else{a1=sap.ui.require(W.getMetadata().getName().replace(/\./g,"/"));b1=m(W.oFormatOptions,{emptyString:null});$=new a1(b1,W.oConstraints);}break;case B.Date:case B.Time:case B.DateTime:$=W;break;default:$=W;break;}return $;}function s(){var i=this.getFormatOptions();var V=i&&i.operators;if(!V||V.length===0){V=F.getOperatorsForType(B.String);}return V;}function t(){if(!this.oOperatorModel){return;}var V=u.call(this);var W=s.call(this);var X=o.getText("valuehelp.INCLUDE");var Y=o.getText("valuehelp.EXCLUDE");var Z=[];for(var i=0;i<W.length;i++){var $=W[i];var a1=F.getOperator($);if(!a1||(a1.showInSuggest!==undefined&&a1.showInSuggest==false)){continue;}var b1=a1.textKey||"operators."+a1.name+".longText";var c1=a1.getTypeText(b1,V.getName().toLowerCase());if(c1===b1){c1=a1.longText;}var d1=a1.additionalInfo;if(d1===undefined){if(d1!==""&&a1.formatRange){d1=a1.formatRange(a1._getRange(undefined,V),V);}else{d1=a1.exclude?Y:X;}}Z.push({key:a1.name,additionalText:c1,info:d1});}this.oOperatorModel.setData(Z);}function u(){var i=this.getFormatOptions();var V=i&&i.valueType;if(!V){V=v.call(this);}return V;}function v(){if(!this._oDefaultType){this._oDefaultType=new S();}return this._oDefaultType;}function w(i){var V=i.getMetadata().getName();var W=i.oFormatOptions;var X=i.oConstraints;var Y=this.getFormatOptions().delegate;var Z=this.getFormatOptions().payload;var $=Y?Y.getTypeUtil(Z).getBaseType(V,W,X):B.String;if($===B.Unit){$=B.Numeric;}return $;}function x(){var i=this.getFormatOptions();var V=i.delegateName||"sap/ui/mdc/field/FieldBaseDelegate";var W=i.payload;return{name:V,payload:W};}function y(V,W,X){var Y=u.call(this);var Z=[];var i=0;for(i=0;i<V.length;i++){var $=V[i];var a1=F.getOperator($.operator);if(a1&&a1.valueTypes[0]===O.ValueType.Static&&($.values.length===0||X)){if(a1.getStaticText){var b1=a1.getStaticText(Y);if($.values.length>0){$.values[0]=b1;}else{$.values.push(b1);}Z.push(i);}}}if(Z.length>0){this.setProperty("conditions",V,true);}}function z(){var i=new I(this.getId()+"--ivtOperator",{text:"{$i18n>valuehelp.DEFINECONDITIONS_OPERATORLABEL}"});var V=new j({height:"100%",horizontal:false,vertical:true});V.addDependent(new L(this.getId()+"--rowSelect-help",{items:{path:'om>/',templateShareable:false,template:new g({key:"{om>key}",text:"{om>additionalText}",additionalText:"{om>info}"})},filterList:false,useFirstMatch:true}));var W=new G(this.getId()+"--conditions",{width:"100%",hSpacing:0,vSpacing:0,containerQuery:true}).addStyleClass("sapUiMdcDefineConditionGrid");K.call(this,undefined,W,0,null,0);V.addContent(i);V.addContent(W);var X=new k(this.getId()+"--addBtn",{press:this.addCondition.bind(this),type:n.Default,text:"{$i18n>valuehelp.DEFINECONDITIONS_ADDCONDITION}",layoutData:new h({span:"XL2 L3 M3 S3",indent:"XL9 L8 M8 S7",linebreak:true,visibleS:{path:"$this>/conditions",formatter:A.bind(this)},visibleM:{path:"$this>/conditions",formatter:A.bind(this)},visibleL:{path:"$this>/conditions",formatter:A.bind(this)},visibleXL:{path:"$this>/conditions",formatter:A.bind(this)}})}).addStyleClass("sapUiSmallPaddingBegin");W.addContent(X);this.setAggregation("_content",V);}function A(i){var V=this.getFormatOptions();var W=V.hasOwnProperty("maxConditions")?V.maxConditions:-1;return W===-1||i.length<W;}function H(){var V=this.getConditions();var W=this.byId("conditions");var X;var Y=-1;var Z=0;for(var i=0;i<V.length;i++){var $=V[i];if($.validated!==c.Validated){var a1=this._oManagedObjectModel.getContext("/conditions/"+i+"/");Y++;if(!this.oOperatorModel){this.oOperatorModel=new J();this.setModel(this.oOperatorModel,"om");t.call(this);}X=W.getContent();if(X[Z]&&X[Z].isA("sap.ui.mdc.Field")){Z=U.call(this,$,W,Z,a1,Y);}else{Z=K.call(this,$,W,Z,a1,Y);}}}X=W.getContent();while(X[Z]&&X[Z]!==this.byId("addBtn")){X[Z].destroy();Z++;}if(this._bFocusLastCondition){X[0].focus();this._bFocusLastCondition=false;}}function K(V,W,X,Y,Z){var $=this.getId()+"--"+Z;if(!this._oOperatorFieldType){this._oOperatorFieldType=new S({},{minLength:1});}var a1=new e($+"-operator",{value:{path:"$this>operator",type:this._oOperatorFieldType},width:"100%",display:"Description",fieldHelp:this.getId()+"--rowSelect-help",change:this.onSelectChange.bind(this),ariaLabelledBy:this.getId()+"--ivtOperator"}).addStyleClass("sapUiSmallPaddingBegin").setLayoutData(new h({span:"XL3 L3 M3 S10",linebreak:true})).setBindingContext(Y,"$this");this._oObserver.observe(a1,{properties:["value"]});W.insertContent(a1,X);X++;var b1=new k($+"--removeBtnSmall",{press:this.removeCondition.bind(this),type:n.Transparent,icon:"sap-icon://decline",tooltip:"{$i18n>valuehelp.DEFINECONDITIONS_REMOVECONDITION}"}).addStyleClass("sapUiSmallPaddingBegin").setLayoutData(new h({span:"XL1 L1 M1 S2",indent:{path:"$this>operator",formatter:P},visibleXL:false,visibleL:false,visibleM:false,visibleS:true})).setBindingContext(Y,"$this");W.insertContent(b1,X);X++;if(V){for(var i=0;i<V.values.length;i++){var c1=q.call(this,V,i,$+"-values"+i,Y);if(c1){W.insertContent(c1,X);X++;}}}var d1=new k($+"--removeBtnLarge",{press:this.removeCondition.bind(this),type:n.Transparent,icon:"sap-icon://decline",tooltip:"{$i18n>valuehelp.DEFINECONDITIONS_REMOVECONDITION}"}).addStyleClass("sapUiSmallPaddingBegin").setLayoutData(new h({span:"XL1 L1 M1 S1",indent:{path:"$this>operator",formatter:P},visibleXL:true,visibleL:true,visibleM:true,visibleS:false})).setBindingContext(Y,"$this");W.insertContent(d1,X);X++;return X;}function N(i){if(!i){return E.Display;}var V=F.getOperator(i);var W=false;if(V&&V.valueTypes[0]===O.ValueType.Static){W=true;}return W?E.Display:E.Editable;}function P(i){var V=i&&F.getOperator(i);if(!V||!V.valueTypes[0]){return"XL8 L8 M8 S0";}else{return"";}}function Q(i){var V=i&&F.getOperator(i);if(V&&V.valueTypes[1]){return"XL4 L4 M4 S10";}else{return"XL8 L8 M8 S10";}}function T(i){var V=i&&F.getOperator(i);if(V&&V.valueTypes[1]){return o.getText("valuehelp.DEFINECONDITIONS_FROM");}else{return o.getText("valuehelp.DEFINECONDITIONS_VALUE");}}function U(V,W,X,Y,Z){var $=this.getId()+"--"+Z;var a1=W.getContent();var b1;var c1=a1[X];c1.setBindingContext(Y,"$this");X++;var d1=a1[X];d1.setBindingContext(Y,"$this");X++;var e1;var f1=a1[X];var g1;if(f1.hasOwnProperty("_iValueIndex")&&f1._iValueIndex===0){var h1=N(V.operator);if(V.values.length>0||h1===E.Display){e1=this._oManagedObjectModel.getContext(Y.getPath()+"values/0/");f1.setBindingContext(e1,"$this");f1.setBindingContext(Y,"$condition");if(f1.getMetadata().hasProperty("value")&&(this._bUpdateType||!f1.getBindingInfo("value"))){b1=r.call(this,V.operator,0);f1.bindProperty("value",{path:"$this>",type:b1});}X++;g1=a1[X];if(g1.hasOwnProperty("_iValueIndex")&&g1._iValueIndex===1){if(V.values.length>1){e1=this._oManagedObjectModel.getContext(Y.getPath()+"values/1/");g1.setBindingContext(e1,"$this");if(g1.getMetadata().hasProperty("value")&&(this._bUpdateType||!g1.getBindingInfo("value"))){b1=r.call(this,V.operator,1);g1.bindProperty("value",{path:"$this>",type:b1});}X++;}else{g1.destroy();}}else if(V.values.length>1){g1=q.call(this,V,1,$+"-values1",Y);if(g1){W.insertContent(g1,X);X++;}}}else{f1.destroy();g1=a1[X+1];if(g1){g1.destroy();}}}else if(V.values.length>0){for(var i=0;i<V.values.length;i++){var i1=q.call(this,V,i,$+"-values"+i,Y);if(i1){W.insertContent(i1,X);X++;}}}a1=W.getContent();var j1=a1[X];j1.setBindingContext(Y,"$this");X++;return X;}return D;});
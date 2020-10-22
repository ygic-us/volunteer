/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/core/IconPool','sap/m/library','sap/ui/Device','sap/ui/core/InvisibleText','sap/ui/core/library'],function(R,I,l,D,a,c){"use strict";var T=c.TextDirection;var V=c.ValueState;var S=l.SelectType;var b={apiVersion:2};b.CSS_CLASS="sapMSlt";b.render=function(r,s){var t=s.getTooltip_AsString(),d=s.getType(),A=s.getAutoAdjustWidth(),e=s.getEditable(),E=s.getEnabled(),C=s.getWidth(),w=C.indexOf("%")>-1,f=A||C==="auto"||w,g=b.CSS_CLASS;r.openStart("div",s);this.addClass(r,s);r.class(g);r.class(g+s.getType());if(!E){r.class(g+"Disabled");}else if(!e){r.class(g+"Readonly");}if(f&&(d===S.Default)){r.class(g+"MinWidth");}if(A){r.class(g+"AutoAdjustedWidth");}else{r.style("width",C);}if(s.getIcon()){r.class(g+"WithIcon");}if(E&&e&&D.system.desktop){r.class(g+"Hoverable");}r.class(g+"WithArrow");if(s.getValueState()!==V.None){this.addValueStateClasses(r,s);}r.style("max-width",s.getMaxWidth());if(t){r.attr("title",t);}else if(d===S.IconOnly){var i=I.getIconInfo(s.getIcon());if(i){r.attr("title",i.text);}}r.openEnd();this.renderHiddenSelect(r,s);this.renderLabel(r,s);switch(d){case S.Default:this.renderArrow(r,s);break;case S.IconOnly:this.renderIcon(r,s);break;}var L=s.getList();if(s._isShadowListRequired()&&L){this.renderShadowList(r,L);}r.close("div");};b.renderHiddenSelect=function(r,s){var L=s.getList(),d,i;r.openStart("select",s.getId()+"-hiddenSelect");this.writeAccessibilityState(r,s);if(s.getRequired()){r.attr("required","required");}if(!s.getEnabled()){r.attr("disabled","disabled");}r.attr("name",s.getName());r.attr("value",s.getSelectedKey());r.class("sapUiPseudoInvisibleText");r.class(b.CSS_CLASS+"HiddenSelect");r.openEnd();for(i=0,d=L.getItems();i<d.length;i++){r.openStart("option");r.attr("value",d[i].getText());r.attr("hidden",true);r.openEnd();r.text(d[i].getText());r.close("option");}r.close('select');};b.renderLabel=function(r,s){var o=s.getSelectedItem(),t=s.getTextDirection(),d=R.getTextAlign(s.getTextAlign(),t),C=b.CSS_CLASS;r.openStart("span",s.getId()+"-label");r.class(C+"Label");if(s.getValueState()!==V.None){r.class(C+"LabelState");r.class(C+"Label"+s.getValueState());}if(s.getType()===S.IconOnly){r.class("sapUiPseudoInvisibleText");}if(t!==T.Inherit){r.attr("dir",t.toLowerCase());}r.style("text-align",d);r.openEnd();if(s.getType()!==S.IconOnly){r.renderControl(s._getValueIcon());r.openStart("span",s.getId()+"-labelText");r.class("sapMSelectListItemText");r.openEnd();r.text(o&&o.getParent()?o.getText():null);r.close("span");}r.close("span");};b.renderArrow=function(r,s){var C=b.CSS_CLASS;r.openStart("span",s.getId()+"-arrow");r.class(C+"Arrow");if(s.getValueState()!==V.None){r.class(C+"ArrowState");}r.openEnd().close("span");};b.renderIcon=function(r,s){var t=s.getTooltip_AsString();r.icon(s.getIcon(),b.CSS_CLASS+"Icon",{id:s.getId()+"-icon",title:t||null});};b.renderShadowList=function(r,L){var o=L.getRenderer();o.writeOpenListTag(r,L,{elementData:false});this.renderShadowItems(r,L);o.writeCloseListTag(r,L);};b.renderShadowItems=function(r,L){var o=L.getRenderer(),s=L.getItems().length,d=L.getSelectedItem();for(var i=0,e=L.getItems();i<e.length;i++){o.renderItem(r,L,e[i],{selected:d===e[i],setsize:s,posinset:i+1,elementData:false});}};b.addClass=function(r,s){};b.addValueStateClasses=function(r,s){r.class(b.CSS_CLASS+"State");r.class(b.CSS_CLASS+s.getValueState());};b.getAriaRole=function(s){switch(s.getType()){case S.Default:return"combobox";case S.IconOnly:return"button";}};b._getValueStateString=function(s){var C="sap.ui.core";switch(s.getValueState()){case V.Success:return a.getStaticId(C,"VALUE_STATE_SUCCESS");case V.Warning:return a.getStaticId(C,"VALUE_STATE_WARNING");case V.Information:return a.getStaticId(C,"VALUE_STATE_INFORMATION");}return"";};b.writeAccessibilityState=function(r,s){var v=this._getValueStateString(s),o=s.getSelectedItem(),i=s.getType()===S.IconOnly,d=s._getValueIcon(),L=[],A=[],e,f,g;s.getLabels().forEach(function(j){if(j&&j.getId){L.push(j.getId());}});if(s.isOpen()&&o&&o.getDomRef()){f=o.getId();}if(o&&!o.getText()&&o.getIcon&&o.getIcon()){var h=I.getIconInfo(o.getIcon());if(h){g=h.text||h.name;}}if(g&&d){v=d.getId();}if(v){A.push(v);}if(L.length){A=A.concat(L);}e={value:A.join(" "),append:true};r.accessibilityState(null,{role:this.getAriaRole(s),roledescription:s._sAriaRoleDescription,readonly:i?undefined:s.getEnabled()&&!s.getEditable(),expanded:s.isOpen(),invalid:(s.getValueState()===V.Error)?true:undefined,labelledby:(i||e.value==="")?undefined:e,activedescendant:f,haspopup:"listbox"});};return b;},true);

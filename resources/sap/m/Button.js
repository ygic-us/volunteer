/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/ShortcutHintsMixin","sap/ui/core/EnabledPropagator","sap/ui/core/IconPool","sap/ui/Device","sap/ui/core/ContextMenuSupport","sap/ui/core/library","./ButtonRenderer","sap/ui/events/KeyCodes","sap/ui/core/LabelEnablement","sap/m/BadgeEnabler","sap/ui/core/InvisibleText"],function(l,C,S,E,I,D,a,c,B,K,L,b,d){"use strict";var T=c.TextDirection;var e=l.ButtonType;var f=l.ButtonAccessibilityType;var g=l.BadgeState;var h=C.extend("sap.m.Button",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:""},type:{type:"sap.m.ButtonType",group:"Appearance",defaultValue:e.Default},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},iconFirst:{type:"boolean",group:"Appearance",defaultValue:true},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{tap:{deprecated:true},press:{}},designtime:"sap/m/designtime/Button.designtime",dnd:{draggable:true,droppable:false}}});E.call(h.prototype);a.apply(h.prototype);b.call(h.prototype);h.prototype.init=function(){this._onmouseenter=this._onmouseenter.bind(this);this._buttonPressed=false;S.addConfig(this,{event:"press",position:"0 0",addAccessibilityLabel:true},this);this.initBadgeEnablement({position:"topRight",selector:{suffix:"inner"}});this._oBadgeData={value:"",state:""};};h.prototype.onBadgeUpdate=function(v,s){var V=parseInt(v);if(!this.getDomRef()){return;}if(V<1&&s!==g.Disappear){this.updateBadgeVisibility(false);return;}else if(V>9999&&v.indexOf("+")===-1){v="999+";this.updateBadgeValue(v);return;}if(this._oBadgeData.value!==v||this._oBadgeData.state!==s){this._updateBadgeInvisibleText(v);this._oBadgeData={value:v,state:s};this.invalidate();}};h.prototype._updateBadgeInvisibleText=function(v){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m"),i,p;v=v.toString().trim();p=v.indexOf("+");if(p!==-1){i=r.getText("BUTTON_BADGE_MORE_THAN_ITEMS",v.substr(0,p));}else{switch(v){case"":i="";break;case"1":i=r.getText("BUTTON_BADGE_ONE_ITEM",v);break;default:i=r.getText("BUTTON_BADGE_MANY_ITEMS",v);}}this._getBadgeInvisibleText().setText(i);};h.prototype._getBadgeInvisibleText=function(){return this._oBadgeInvisibleText||(this._oBadgeInvisibleText=new d(this.getId()+"-badge").toStatic());};h.prototype.exit=function(){if(this._image){this._image.destroy();}if(this._iconBtn){this._iconBtn.destroy();}if(this._oBadgeInvisibleText){this._oBadgeInvisibleText.destroy();this._oBadgeData=null;}this.$().off("mouseenter",this._onmouseenter);};h.prototype.setType=function(s){this.setProperty("type",s,false);if(s===e.Critical){this._sTypeIconURI="sap-icon://message-warning";}else if(s===e.Negative){this._sTypeIconURI="sap-icon://message-error";}else if(s===e.Success){this._sTypeIconURI="sap-icon://message-success";}else if(s===e.Neutral){this._sTypeIconURI="sap-icon://message-information";}else{this._sTypeIconURI=null;}return this;};h.prototype.onBeforeRendering=function(){this._bRenderActive=this._bActive;this.$().off("mouseenter",this._onmouseenter);};h.prototype.onAfterRendering=function(){if(this._bRenderActive){this._activeButton();this._bRenderActive=this._bActive;}this.$().on("mouseenter",this._onmouseenter);};h.prototype.ontouchstart=function(o){o.setMarked();if(this._bRenderActive){delete this._bRenderActive;}if(o.targetTouches.length===1){this._buttonPressed=true;this._activeButton();}if(this.getEnabled()&&this.getVisible()){if((D.browser.safari||D.browser.firefox)&&(o.originalEvent&&o.originalEvent.type==="mousedown")){this._setButtonFocus();}if(!sap.ui.Device.browser.msie){this._sTouchStartTargetId=o.target.id.replace(this.getId(),'');}}else{if(!sap.ui.Device.browser.msie){this._sTouchStartTargetId='';}}};h.prototype.ontouchend=function(o){var s;this._buttonPressed=o.originalEvent&&o.originalEvent.buttons&1;this._inactiveButton();if(this._bRenderActive){delete this._bRenderActive;this.ontap(o,true);}if(!sap.ui.Device.browser.msie){s=o.target.id.replace(this.getId(),'');if(this._buttonPressed===0&&((this._sTouchStartTargetId==="-BDI-content"&&(s==='-content'||s==='-inner'||s==='-img'))||(this._sTouchStartTargetId==="-content"&&(s==='-inner'||s==='-img'))||(this._sTouchStartTargetId==='-img'&&s!=='-img'))){this.ontap(o,true);}}this._sTouchStartTargetId='';};h.prototype.ontouchcancel=function(){this._buttonPressed=false;this._sTouchStartTargetId='';this._inactiveButton();};h.prototype.ontap=function(o,F){o.setMarked();delete this._bRenderActive;if(this.bFromTouchEnd){return;}if(this.getEnabled()&&this.getVisible()){if((o.originalEvent&&o.originalEvent.type==="touchend")){this.focus();}this.fireTap({});this.firePress({});}this.bFromTouchEnd=F;if(this.bFromTouchEnd){setTimeout(function(){delete this.bFromTouchEnd;}.bind(this),0);}};h.prototype.onkeydown=function(o){if(o.which===K.SPACE||o.which===K.ENTER||o.which===K.ESCAPE||o.which===K.SHIFT){if(o.which===K.SPACE||o.which===K.ENTER){o.setMarked();this._activeButton();}if(o.which===K.ENTER){this.firePress({});}if(o.which===K.SPACE){this._bPressedSpace=true;}if(this._bPressedSpace){if(o.which===K.SHIFT||o.which===K.ESCAPE){this._bPressedEscapeOrShift=true;this._inactiveButton();}}}else{if(this._bPressedSpace){o.preventDefault();}}};h.prototype.onkeyup=function(o){if(o.which===K.ENTER){o.setMarked();this._inactiveButton();}if(o.which===K.SPACE){if(!this._bPressedEscapeOrShift){o.setMarked();this._inactiveButton();this.firePress({});}else{this._bPressedEscapeOrShift=false;}this._bPressedSpace=false;}if(o.which===K.ESCAPE){this._bPressedSpace=false;}};h.prototype._onmouseenter=function(o){if(this._buttonPressed&&o.originalEvent&&o.originalEvent.buttons&1){this._activeButton();}};h.prototype.onfocusout=function(){this._buttonPressed=false;this._sTouchStartTargetId='';this._inactiveButton();};h.prototype._activeButton=function(){if(!this._isUnstyled()){this.$("inner").addClass("sapMBtnActive");}this._bActive=this.getEnabled();if(this._bActive){if(this._getAppliedIcon()&&this.getActiveIcon()&&this._image){this._image.setSrc(this.getActiveIcon());}}};h.prototype._inactiveButton=function(){if(!this._isUnstyled()){this.$("inner").removeClass("sapMBtnActive");}this._bActive=false;if(this.getEnabled()){if(this._getAppliedIcon()&&this.getActiveIcon()&&this._image){this._image.setSrc(this._getAppliedIcon());}}};h.prototype._isHoverable=function(){return this.getEnabled()&&D.system.desktop;};h.prototype._getImage=function(i,s,A,j){var k=I.isIconURI(s),m;if(this._image instanceof sap.m.Image&&k||this._image instanceof sap.ui.core.Icon&&!k){this._image.destroy();this._image=undefined;}m=this.getIconFirst();if(this._image){this._image.setSrc(s);if(this._image instanceof sap.m.Image){this._image.setActiveSrc(A);this._image.setDensityAware(j);}}else{this._image=I.createControlByURI({id:i,src:s,activeSrc:A,densityAware:j,useIconTooltip:false},sap.m.Image).addStyleClass("sapMBtnCustomIcon").setParent(this,null,true);}this._image.addStyleClass("sapMBtnIcon");this._image.toggleStyleClass("sapMBtnIconLeft",m);this._image.toggleStyleClass("sapMBtnIconRight",!m);return this._image;};h.prototype._getInternalIconBtn=function(i,s){var o=this._iconBtn;if(o){o.setSrc(s);}else{o=I.createControlByURI({id:i,src:s,useIconTooltip:false},sap.m.Image).setParent(this,null,true);}o.addStyleClass("sapMBtnIcon");o.addStyleClass("sapMBtnIconLeft");this._iconBtn=o;return this._iconBtn;};h.prototype._isUnstyled=function(){var u=false;if(this.getType()===e.Unstyled){u=true;}return u;};h.prototype.getPopupAnchorDomRef=function(){return this.getDomRef("inner");};h.prototype._getText=function(){return this.getText();};h.prototype._getTooltip=function(){var t,i;t=this.getTooltip_AsString();if(!t&&!this.getText()){i=I.getIconInfo(this._getAppliedIcon());if(i){t=i.text?i.text:i.name;}}return t;};h.prototype._getAppliedIcon=function(){return this.getIcon()||this._sTypeIconURI;};h.prototype.getAccessibilityInfo=function(){var s=this.getText()||this.getTooltip_AsString();if(!s&&this._getAppliedIcon()){var i=I.getIconInfo(this._getAppliedIcon());if(i){s=i.text||i.name;}}return{role:"button",type:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_BUTTON"),description:s,focusable:this.getEnabled(),enabled:this.getEnabled()};};h.prototype._setButtonFocus=function(){setTimeout(function(){this.focus();}.bind(this),0);};h.prototype._determineSelfReferencePresence=function(){var A=this.getAriaLabelledBy(),i=A.indexOf(this.getId())!==-1,H=L.getReferencingLabels(this).length>0,p=this.getParent(),j=!!(p&&p.enhanceAccessibilityState);return!i&&this._getText()&&(A.length>0||H||j);};h.prototype._determineAccessibilityType=function(){var H=this.getAriaLabelledBy().length>0,i=this.getAriaDescribedBy().length>0,j=L.getReferencingLabels(this).length>0,k=this.getType()!==e.Default,m=H||j,n=i||k||(this._oBadgeData&&this._oBadgeData.value!==""&&this._oBadgeData.State!==g.Disappear),A;if(!m&&!n){A=f.Default;}else if(m&&!n){A=f.Labelled;}else if(!m&&n){A=f.Described;}else if(m&&n){A=f.Combined;}return A;};h.prototype._getTitleAttribute=function(s){return this.getTooltip();};return h;});

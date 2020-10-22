/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/delegate/ItemNavigation','sap/ui/base/ManagedObject','sap/ui/core/delegate/ScrollEnablement','./AccButton','./TabStripItem','sap/m/Select','sap/m/SelectList','sap/ui/Device','sap/ui/core/Renderer','sap/ui/core/ResizeHandler','sap/m/library','sap/ui/core/Icon','sap/m/Image','sap/m/SelectRenderer','sap/m/SelectListRenderer','./TabStripRenderer',"sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control","sap/ui/dom/jquery/scrollLeftRTL"],function(C,I,a,M,S,A,T,b,c,D,R,d,l,e,f,g,h,i,L,q){"use strict";var j=l.SelectType;var B=l.ButtonType;var k=C.extend("sap.m.TabStrip",{metadata:{library:"sap.m",properties:{hasSelect:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{items:{type:"sap.m.TabStripItem",multiple:true,singularName:"item"},addButton:{type:"sap.m.Button",multiple:false,singularName:"addButton"},_select:{type:'sap.m.Select',multiple:false,visibility:"hidden"},_rightArrowButton:{type:'sap.m.AccButton',multiple:false,visibility:"hidden"},_leftArrowButton:{type:'sap.m.AccButton',multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:'sap.m.TabStripItem',group:"Misc"}},events:{itemClose:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabStripItem"}}},itemPress:{parameters:{item:{type:"sap.m.TabStripItem"}}},itemSelect:{allowPreventDefault:true,parameters:{item:{type:"sap.m.TabContainerItem"}}}}},constructor:function(v,s){var H=false;if(!s&&typeof v==='object'){s=v;}if(s){H=s['hasSelect'];delete s['hasSelect'];}M.prototype.constructor.apply(this,arguments);this.setProperty('hasSelect',H,true);}});var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");k.ICON_BUTTONS={LeftArrowButton:"slim-arrow-left",RightArrowButton:"slim-arrow-right",DownArrowButton:D.system.phone?"navigation-down-arrow":"slim-arrow-down",AddButton:"add"};k.SELECT_ITEMS_ID_SUFFIX='-SelectItem';k.SCROLL_SIZE=320;k.MIN_DRAG_OFFSET=D.support.touch?15:5;k.SCROLL_ANIMATION_DURATION=sap.ui.getCore().getConfiguration().getAnimation()?500:0;k.prototype.init=function(){this._bDoScroll=!D.system.phone;this._bRtl=sap.ui.getCore().getConfiguration().getRTL();this._iCurrentScrollLeft=0;this._iMaxOffsetLeft=null;this._scrollable=null;this._oTouchStartX=null;if(!D.system.phone){this._oScroller=new S(this,this.getId()+"-tabs",{horizontal:true,vertical:false,nonTouchScrolling:true});}};k.prototype.exit=function(){this._bRtl=null;this._iCurrentScrollLeft=null;this._iMaxOffsetLeft=null;this._scrollable=null;this._oTouchStartX=null;if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._sResizeListenerId){d.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}this._removeItemNavigation();};k.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){d.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};k.prototype.onAfterRendering=function(){if(this._oScroller){this._oScroller.setIconTabBar(this,q.proxy(this._handleOverflowButtons,this),null);}this._addItemNavigation();if(!D.system.phone){this._oScroller._$Container=this.$("tabsContainer");this._adjustScrolling();if(this.getSelectedItem()){if(!sap.ui.getCore().isThemeApplied()){sap.ui.getCore().attachThemeChanged(this._handleInititalScrollToItem,this);}else{this._handleInititalScrollToItem();}}this._sResizeListenerId=d.register(this.getDomRef(),q.proxy(this._adjustScrolling,this));}else{this.$().toggleClass("sapUiSelectable",this.getItems().length>1);}};k.prototype._handleInititalScrollToItem=function(){var s=sap.ui.getCore().byId(this.getSelectedItem());if(s&&s.$().length>0){this._scrollIntoView(s,500);}sap.ui.getCore().detachThemeChanged(this._handleInititalScrollToItem,this);};k.prototype.getFocusDomRef=function(){var t=sap.ui.getCore().byId(this.getSelectedItem());if(!t){return null;}return t.getDomRef();};k.prototype.applyFocusInfo=function(F){if(F.focusDomRef){q(F.focusDomRef).trigger("focus");}};k.prototype._addItemNavigation=function(){var H=this.getDomRef("tabsContainer"),s=this.getItems(),t=[];s.forEach(function(u){var v=u.getDomRef();q(v).attr("tabindex","-1");t.push(v);});if(!this._oItemNavigation){this._oItemNavigation=new a();}this._oItemNavigation.setRootDomRef(H);this._oItemNavigation.setItemDomRefs(t);this._oItemNavigation.setCycling(false);this._oItemNavigation.setPageSize(5);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"]});this.addDelegate(this._oItemNavigation);};k.prototype._checkScrolling=function(){var t=this.getDomRef("tabs"),s=t&&(t.scrollWidth>this.getDomRef("tabsContainer").offsetWidth);this.$().toggleClass("sapMTSScrollable",s);return s;};k.prototype._handleOverflowButtons=function(){var t=this.getDomRef("tabs"),s=this.getDomRef("tabsContainer"),u,v,w,x=false,y=false,z=this._checkScrolling();if(z&&!this.getAggregation("_rightArrowButton")&&!this.getAggregation("_leftArrowButton")){this._getLeftArrowButton();this._getRightArrowButton();var E=sap.ui.getCore().createRenderManager();this.getRenderer().renderRightOverflowButtons(E,this,true);this.getRenderer().renderLeftOverflowButtons(E,this,true);E.destroy();}if(z&&t&&s){if(this._bRtl){u=q(s).scrollLeftRTL();}else{u=s.scrollLeft;}v=t.scrollWidth;w=s.clientWidth;if(Math.abs(v-w)===1){v=w;}if(u>0){if(this._bRtl){y=true;}else{x=true;}}if((v>w)&&(u+w<v)){if(this._bRtl){x=true;}else{y=true;}}this.$().toggleClass("sapMTSScrollBack",x).toggleClass("sapMTSScrollForward",y);}else{this.$().toggleClass("sapMTSScrollBack",false).toggleClass("sapMTSScrollForward",false);}};k.prototype._adjustScrolling=function(){this._iMaxOffsetLeft=Math.abs(this.$("tabsContainer").width()-this.$("tabs").width());this._handleOverflowButtons();};k.prototype._getLeftArrowButton=function(){return this._getArrowButton("_leftArrowButton",r.getText("TABSTRIP_SCROLL_BACK"),k.ICON_BUTTONS.LeftArrowButton,-k.SCROLL_SIZE);};k.prototype._getRightArrowButton=function(){return this._getArrowButton("_rightArrowButton",r.getText("TABSTRIP_SCROLL_FORWARD"),k.ICON_BUTTONS.RightArrowButton,k.SCROLL_SIZE);};k.prototype._getArrowButton=function(s,t,u,v){var w=this.getAggregation(s),x=this;if(!w){w=new A({type:B.Transparent,icon:I.getIconURI(u),tooltip:t,tabIndex:"-1",ariaHidden:"true",press:function(E){x._scroll(v,k.SCROLL_ANIMATION_DURATION);}});this.setAggregation(s,w,true);}return w;};k.prototype._removeItemNavigation=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}};k.prototype._scroll=function(s,t){var u=this.getDomRef("tabsContainer").scrollLeft,v=D.browser.internet_explorer||D.browser.edge,w;if(this._bRtl&&!v){w=u-s;if(D.browser.firefox){if(w<-this._iMaxOffsetLeft){w=-this._iMaxOffsetLeft;}if(w>0){w=0;}}}else{w=u+s;if(w<0){w=0;}if(w>this._iMaxOffsetLeft){w=this._iMaxOffsetLeft;}}this._oScroller.scrollTo(w,0,t);this._iCurrentScrollLeft=w;};k.prototype._scrollIntoView=function(s,t){var $=this.$("tabs"),u=s.$(),v=$.innerWidth()-$.width(),w=u.outerWidth(true),x=u.position().left-v/2,y=this.getDomRef("tabsContainer"),z=y.scrollLeft,E=this.$("tabsContainer").width(),N=z,F=D.browser.internet_explorer||D.browser.edge;if(x<0||x>E-w){if(this._bRtl&&D.browser.firefox){if(x<0){N+=x+w-E;}else{N+=x;}}else if(this._bRtl&&F){if(x<0){N-=x;}else{N-=x+w-E;}}else{if(x<0){N+=x;}else{N+=x+w-E;}}this._iCurrentScrollLeft=N;this._oScroller.scrollTo(N,0,t);}};k.prototype._createSelect=function(t){var s,u,v,w={type:j.IconOnly,autoAdjustWidth:true,maxWidth:"2.5rem",icon:I.getIconURI(k.ICON_BUTTONS.DownArrowButton),tooltip:r.getText("TABSTRIP_OPENED_TABS"),change:function(E){u=E.getParameters()['selectedItem'];v=this._findTabStripItemFromSelectItem(u);if(v instanceof T){this._activateItem(v,E);}}.bind(this)};s=new n(w).addStyleClass("sapMTSOverflowSelect");this._addItemsToSelect(s,t);return s;};k.prototype.onsapselect=function(E){E.setMarked();E.preventDefault();if(E.srcControl instanceof T){this._activateItem(E.srcControl,E);}};k.prototype.onsapdelete=function(E){var s=q("#"+E.target.id).control(0),t=s.getId()===this.getSelectedItem(),u=function(){this._moveToNextItem(t);};this._removeItem(s,u);};k.prototype._moveToNextItem=function(s){if(!this._oItemNavigation){return;}var t=this.getItems().length,u=this._oItemNavigation.getFocusedIndex(),N=t===u?--u:u,v=this.getItems()[N],F=function(){if(this._oItemNavigation){this._oItemNavigation.focusItem(N);}};if(s){this.setSelectedItem(v);this.fireItemPress({item:v});}setTimeout(F.bind(this),0);};k.prototype._activateItem=function(s,E){if(this.fireItemSelect({item:s})){if(!this.getSelectedItem()||this.getSelectedItem()!==s.getId()){this.setSelectedItem(s);}this.fireItemPress({item:s});}else if(E&&!E.isDefaultPrevented()){E.preventDefault();}};k.prototype.addAggregation=function(s,O,t){if(s==='items'){this._handleItemsAggregation(['addAggregation',O,t],true);}return C.prototype.addAggregation.call(this,s,O,t);};k.prototype.insertAggregation=function(s,O,t,u){if(s==='items'){this._handleItemsAggregation(['insertAggregation',O,t,u],true);}return C.prototype.insertAggregation.call(this,s,O,t,u);};k.prototype.removeAggregation=function(s,O,t){if(s==='items'){this._handleItemsAggregation(['removeAggregation',O,t]);}return C.prototype.removeAggregation.call(this,s,O,t);};k.prototype.removeAllAggregation=function(s,t){if(s==='items'){this._handleItemsAggregation(['removeAllAggregation',null,t]);}return C.prototype.removeAllAggregation.call(this,s,t);};k.prototype.destroyAggregation=function(s,t){if(s==='items'){this._handleItemsAggregation(['destroyAggregation',t]);}return C.prototype.destroyAggregation.call(this,s,t);};k.prototype.setSelectedItem=function(s){var N=!D.system.phone;if(!s){return this;}if(s.$().length>0&&N){this._scrollIntoView(s,500);}if(N){this._updateAriaSelectedAttributes(this.getItems(),s);this._updateSelectedItemClasses(s.getId());}if(this.getHasSelect()){var t=this._findSelectItemFromTabStripItem(s);this.getAggregation('_select').setSelectedItem(t);}return this.setAssociation("selectedItem",s,N);};k.prototype.setProperty=function(P,v,s){var t;t=C.prototype.setProperty.call(this,P,v,s);if(P==='hasSelect'){if(v){if(!this.getAggregation('_select')){t=this.setAggregation('_select',this._createSelect(this.getItems()));}}else{t=this.destroyAggregation('_select');}}return t;};k.prototype._attachItemEventListeners=function(O){if(O instanceof T){var E=['itemClosePressed','itemPropertyChanged'];E.forEach(function(s){s=s.charAt(0).toUpperCase()+s.slice(1);O['detach'+s](this['_handle'+s]);O['attach'+s](this['_handle'+s].bind(this));},this);}};k.prototype._detachItemEventListeners=function(O){if(!O||typeof O!=='object'||!(O instanceof T)){var s=this.getItems();s.forEach(function(t){if(typeof t!=='object'||!(t instanceof T)){return;}return this._detachItemEventListeners(t);}.bind(this));}};k.prototype._handleItemPropertyChanged=function(E){var s=this._findSelectItemFromTabStripItem(E.getSource());var P=E['mParameters'].propertyKey;var t="set"+P.substr(0,1).toUpperCase()+P.substr(1);s[t](E['mParameters'].propertyValue);};k.prototype._handleItemClosePressed=function(E){this._removeItem(E.getSource());};k.prototype._removeItem=function(s,t){var u;if(!(s instanceof T)){L.error('Expecting instance of a TabStripSelectItem, given: ',s);}if(s.getId().indexOf(k.SELECT_ITEMS_ID_SUFFIX)!==-1){u=this._findTabStripItemFromSelectItem(s);}else{u=s;}if(this.fireItemClose({item:u})){this.removeAggregation('items',u);this._moveToNextItem(s.getId()===this.getSelectedItem());if(t){t.call(this);}}};k.prototype._handleItemsAggregation=function(s,t){var u='items',F=s[0],O=s[1],N=[u];s.forEach(function(v,w){if(w>0){N.push(v);}});if(t){this._attachItemEventListeners(O);}else{this._detachItemEventListeners(O);}if(u!=="items"){return this;}if(this.getHasSelect()){this._handleSelectItemsAggregation(N,t,F,O);}return this;};k.prototype._handleSelectItemsAggregation=function(s,t,F,O){var u=this.getAggregation('_select'),v;if(F==='destroyAggregation'&&!u){return;}if(O===null||typeof O!=='object'){return u[F]['apply'](u,s);}if(t){v=this._createSelectItemFromTabStripItem(O);}else{v=this._findSelectItemFromTabStripItem(O);}s.forEach(function(w,x){if(typeof w==='object'){s[x]=v;}});return u[F]['apply'](u,s);};k.prototype._addItemsToSelect=function(s,t){t.forEach(function(u){var v=this._createSelectItemFromTabStripItem(u);s.addAggregation('items',v);if(u.getId()===this.getSelectedItem()){s.setSelectedItem(v);}},this);};k.prototype._createSelectItemFromTabStripItem=function(t){var s;if(!t&&!(t instanceof sap.m.TabContainerItem)){L.error('Expecting instance of "sap.m.TabContainerItem": instead of '+t+' given.');return;}s=new T({id:t.getId()+k.SELECT_ITEMS_ID_SUFFIX,text:t.getText(),additionalText:t.getAdditionalText(),icon:t.getIcon(),iconTooltip:t.getIconTooltip(),modified:t.getModified(),itemClosePressed:function(E){this._handleItemClosePressed(E);}.bind(this)});s.addEventDelegate({ontap:function(E){var u=E.srcControl;if(E.target.id===u.getParent().getId()+"-img"){E.srcControl=u=u.getParent();}if((u instanceof A||u instanceof e)){this.fireItemClosePressed({item:this});}}},s);return s;};k.prototype._findTabStripItemFromSelectItem=function(t){var s,u=t.getId().replace(k.SELECT_ITEMS_ID_SUFFIX,''),v=this.getItems();for(s=0;s<v.length;s++){if(v[s].getId()===u){return v[s];}}};k.prototype._findSelectItemFromTabStripItem=function(t){var s,u,v=t.getId()+k.SELECT_ITEMS_ID_SUFFIX;if(this.getHasSelect()){u=this.getAggregation('_select').getItems();for(s=0;s<u.length;s++){if(u[s].getId()===v){return u[s];}}}};k.prototype._updateAriaSelectedAttributes=function(s,t){var u;s.forEach(function(v){u="false";if(v.$()){if(t&&t.getId()===v.getId()){u="true";}v.$().attr("aria-selected",u);}});};k.prototype._updateSelectedItemClasses=function(s){if(this.$("tabs")){this.$("tabs").children(".sapMTabStripItemSelected").removeClass("sapMTabStripItemSelected");q("#"+s).addClass("sapMTabStripItemSelected");}};k.prototype.changeItemState=function(v,s){var $;var t=this.getItems();t.forEach(function(u){if(v===u.getId()){$=q(u.$());if(s===true&&!$.hasClass(T.CSS_CLASS_MODIFIED)){$.addClass(T.CSS_CLASS_MODIFIED);}else{$.removeClass(T.CSS_CLASS_MODIFIED);}}});};k.prototype.ontouchstart=function(E){var t=q(E.target).control(0);if(t instanceof T||t instanceof A||t instanceof e||t instanceof f||t instanceof n){this._oTouchStartX=E.changedTouches[0].pageX;}};k.prototype.ontouchend=function(E){var t,s;if(!this._oTouchStartX){return;}t=q(E.target).control(0);if(E.target.id===t.getParent().getId()+"-img"){t=t.getParent();}s=Math.abs(E.changedTouches[0].pageX-this._oTouchStartX);if(s<k.MIN_DRAG_OFFSET){if(t instanceof T){this._activateItem(t,E);}else if(t instanceof A){if(t&&t.getParent&&t.getParent()instanceof T){t=t.getParent();this._removeItem(t);}}else if(t instanceof e){if(t&&t.getParent&&t.getParent().getParent&&t.getParent().getParent()instanceof T){t=t.getParent().getParent();this._removeItem(t);}}this._oTouchStartX=null;}};k.prototype.destroyItems=function(){this.setAssociation("selectedItem",null);return this.destroyAggregation("items");};var m=R.extend(g);m.apiVersion=2;var n=b.extend("sap.m.internal.TabStripSelect",{metadata:{library:"sap.m"},renderer:m});n.prototype.onAfterRendering=function(){b.prototype.onAfterRendering.apply(this,arguments);this.$().attr("tabindex","-1");};n.prototype.onAfterRenderingPicker=function(){var P=this.getPicker();b.prototype.onAfterRenderingPicker.call(this);if(D.system.phone){return;}P.setOffsetX(Math.round(sap.ui.getCore().getConfiguration().getRTL()?this.getPicker().$().width()-this.$().width():this.$().width()-this.getPicker().$().width()));P.setOffsetY(this.$().parents().hasClass('sapUiSizeCompact')?2:3);P._calcPlacement();};n.prototype.createList=function(){this._oList=new p({width:"100%"}).attachSelectionChange(this.onSelectionChange,this).addEventDelegate({ontap:function(E){this.close();}},this);return this._oList;};n.prototype.setValue=function(v){b.prototype.setValue.apply(this,arguments);this.$("label").toggleClass("sapMTSOverflowSelectLabelModified",this.getSelectedItem()&&this.getSelectedItem().getProperty("modified"));return this;};n.prototype._getValueIcon=function(){return null;};var o=R.extend(h);o.apiVersion=2;o.renderItem=function(s,t,u,v){s.openStart("li",u);s.class(h.CSS_CLASS+"ItemBase");s.class(h.CSS_CLASS+"Item");s.class("sapMTSOverflowSelectListItem");if(u.getProperty("modified")){s.class("sapMTSOverflowSelectListItemModified");}if(D.system.desktop){s.class(h.CSS_CLASS+"ItemBaseHoverable");}if(u===t.getSelectedItem()){s.class(h.CSS_CLASS+"ItemBaseSelected");}s.attr("tabindex",0);this.writeItemAccessibilityState.apply(this,arguments);s.openEnd();s.openStart("div");s.class("sapMSelectListItemText");s.openEnd();if(u.getIcon()){s.renderControl(u._getImage());}s.openStart("div");s.class("sapMTSTexts");s.openEnd();this.renderItemText(s,u.getAdditionalText(),T.CSS_CLASS_TEXT);this.renderItemText(s,u.getText(),T.CSS_CLASS_LABEL);s.close("div");s.close("div");s.renderControl(u.getAggregation('_closeButton'));s.close("li");};o.renderItemText=function(s,t,u){s.openStart("div");s.class(u);s.openEnd();s.text(t.slice(0,(D.system.phone?t.length:T.DISPLAY_TEXT_MAX_LENGTH)));if(!D.system.phone&&t.length>T.DISPLAY_TEXT_MAX_LENGTH){s.text('...');}s.close("div");};var p=c.extend("sap.m.internal.TabStripSelectList",{metadata:{library:"sap.m"},renderer:o});return k;});

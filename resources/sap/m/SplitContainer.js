/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/base/DataType','sap/ui/core/Control','sap/ui/core/IconPool','sap/m/semantic/SemanticPage','sap/ui/core/InvisibleText','sap/ui/Device','sap/ui/base/ManagedObject','sap/m/NavContainer','sap/m/Popover','sap/m/Button','./SplitContainerRenderer',"sap/ui/dom/containsOrEquals","sap/base/Log","sap/ui/thirdparty/jquery"],function(l,D,C,I,S,a,b,M,N,P,B,c,d,L,q){"use strict";var e=l.ButtonType;var f=l.PlacementType;var g=l.SplitAppMode;var h=C.extend("sap.m.SplitContainer",{metadata:{library:"sap.m",properties:{defaultTransitionNameDetail:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameMaster:{type:"string",group:"Appearance",defaultValue:"slide"},mode:{type:"sap.m.SplitAppMode",group:"Appearance",defaultValue:g.ShowHideMode},masterButtonText:{type:"string",group:"Appearance",defaultValue:null},masterButtonTooltip:{type:"string",group:"Appearance",defaultValue:null},backgroundColor:{type:"string",group:"Appearance",defaultValue:null},backgroundImage:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},backgroundRepeat:{type:"boolean",group:"Appearance",defaultValue:false},backgroundOpacity:{type:"float",group:"Appearance",defaultValue:1}},aggregations:{masterPages:{type:"sap.ui.core.Control",multiple:true,singularName:"masterPage"},detailPages:{type:"sap.ui.core.Control",multiple:true,singularName:"detailPage"},_navMaster:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_navDetail:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_navPopover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"}},associations:{initialDetail:{type:"sap.ui.core.Control",multiple:false},initialMaster:{type:"sap.ui.core.Control",multiple:false}},events:{masterNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterMasterNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},masterButton:{},beforeMasterOpen:{},afterMasterOpen:{},beforeMasterClose:{},afterMasterClose:{},detailNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterDetailNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}}},designtime:"sap/m/designtime/SplitContainer.designtime"}});h.prototype.init=function(){var t=this;if(sap.ui.getCore().getConfiguration().getAccessibility()&&!h._sAriaPopupLabelId){h._sAriaPopupLabelId=new a({text:''}).toStatic().getId();}this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._aMasterPages=[];this._aDetailPages=[];if(!b.system.phone){this._oMasterNav=new N(this.getId()+"-Master",{width:"",navigate:function(E){t._handleNavigationEvent(E,false,true);},afterNavigate:function(E){t._handleNavigationEvent(E,true,true);t._updateMasterButtonTooltip();}});this._oDetailNav=new N(this.getId()+"-Detail",{width:"",navigate:function(E){t._handleNavigationEvent(E,false,false);},afterNavigate:function(E){t._handleNavigationEvent(E,true,false);}});this.setAggregation("_navMaster",this._oMasterNav,true);this.setAggregation("_navDetail",this._oDetailNav,true);this._createShowMasterButton();this._oPopOver=new P(this.getId()+"-Popover",{placement:f.Bottom,showHeader:false,contentWidth:"320px",contentHeight:"600px",beforeOpen:function(){t.fireBeforeMasterOpen();},beforeClose:function(){t.fireBeforeMasterClose();},afterOpen:function(){t.fireAfterMasterOpen();t._bMasterisOpen=true;},afterClose:function(){t._afterHideMasterAnimation();}}).addStyleClass("sapMSplitContainerPopover");if(h._sAriaPopupLabelId){this._oPopOver.addAriaLabelledBy(h._sAriaPopupLabelId);}this.setAggregation("_navPopover",this._oPopOver,true);}else{this._oMasterNav=this._oDetailNav=new N({width:"",navigate:function(E){t._handleNavigationEvent(E,false,true);},afterNavigate:function(E){t._handleNavigationEvent(E,true,true);}});this.setAggregation("_navMaster",this._oMasterNav,true);}this._oldIsLandscape=b.orientation.landscape;this._bMasterisOpen=false;var t=this;var p=function(r,n,s){return function(o,A,j){r.apply(t[n],arguments);if(A==="pages"&&t[s]&&t[s].indexOf(o)!==-1){t._removePageFromArray(t[s],o);}};};var m=this._oMasterNav._removeChild;this._oMasterNav._removeChild=p(m,"_oMasterNav","_aMasterPages");if(this._oDetailNav){var i=this._oDetailNav._removeChild;this._oDetailNav._removeChild=p(i,"_oDetailNav","_aDetailPages");}};h.prototype.onBeforeRendering=function(){if(this._fnResize){b.resize.detachHandler(this._fnResize);}if(this._bMasterisOpen&&(this._portraitHide()||this._hideMode())){this._oShowMasterBtn.removeStyleClass("sapMSplitContainerMasterBtnHidden");this._bMasterisOpen=false;}this._updateMasterButtonTooltip();this._oMasterNav.setInitialPage(sap.ui.getCore().byId(this.getInitialMaster()));this._oMasterNav.setDefaultTransitionName(this.getDefaultTransitionNameMaster());if(!b.system.phone){this._oDetailNav.setInitialPage(sap.ui.getCore().byId(this.getInitialDetail()));this._oShowMasterBtn.setText(this.getMasterButtonText()||this._rb.getText("SPLITCONTAINER_NAVBUTTON_TEXT"));}this._oDetailNav.setDefaultTransitionName(this.getDefaultTransitionNameDetail());};h.prototype.exit=function(){if(this._fnResize){b.resize.detachHandler(this._fnResize);}delete this._aMasterPages;delete this._aDetailPages;if(this._oShowMasterBtn){this._oShowMasterBtn.destroy();this._oShowMasterBtn=null;}};h.prototype.onAfterRendering=function(){if(!b.system.phone&&this._oPopOver&&this._oPopOver.isOpen()){this._oPopOver.close();}if(!this._fnResize){this._fnResize=q.proxy(this._handleResize,this);}b.resize.attachHandler(this._fnResize);if(b.os.windows&&b.browser.internet_explorer){this._oMasterNav.$().append('<iframe class="sapMSplitContainerMasterBlindLayer" src="about:blank"></iframe>');}setTimeout(function(){this._oMasterNav.removeStyleClass("sapMSplitContainerNoTransition");}.bind(this),0);};h.prototype.applySettings=function(s,o){C.prototype.applySettings.call(this,s,o);this._updateMasterInitialPage();};h.prototype.ontouchstart=function(E){if(!b.system.phone){this._bIgnoreSwipe=(E.originalEvent&&E.originalEvent._sapui_handledByControl);}};h.prototype.onswiperight=function(E){if(b.support.touch===false){return;}if((b.system.tablet||(b.os.windows&&b.os.version>=8))&&(this._portraitHide()||this._hideMode())&&!this._bIgnoreSwipe&&!this._bDetailNavButton){this.showMaster();}};h.prototype.ontap=function(E){if(b.system.phone){return;}var i=true,$=q(E.target).closest(".sapMSplitContainerDetail, .sapMSplitContainerMaster"),m=E.srcControl.getMetadata();if($.length>0&&$.hasClass("sapMSplitContainerDetail")){i=false;}if(((!this._oldIsLandscape&&this.getMode()=="ShowHideMode")||this.getMode()=="HideMode")&&!i&&!d(this._oShowMasterBtn.getDomRef(),E.target)&&(!m.getEvent("tap")||!m.getEvent("press"))){this.hideMaster();}};h.prototype.onswipeleft=function(E){if((b.system.tablet||(b.os.windows&&b.os.version>=8))&&(this._portraitHide()||this._hideMode())&&!this._bIgnoreSwipe){this.hideMaster();}};h.prototype._onMasterButtonTap=function(E){if(b.system.phone){return;}if(!this._oldIsLandscape){if(this.getMode()=="PopoverMode"){if(!this._oPopOver.isOpen()){this._oPopOver.openBy(this._oShowMasterBtn,true);}else{this._oPopOver.close();}}else{this.showMaster();}}else{if(this.getMode()==="HideMode"){this.showMaster();}}};h.prototype.to=function(p,t,i,T){if(this._oMasterNav.getPage(p)){this._oMasterNav.to(p,t,i,T);}else{this._oDetailNav.to(p,t,i,T);}};h.prototype.backToPage=function(p,i,t){if(this._oMasterNav.getPage(p)){this._oMasterNav.backToPage(p,i,t);}else{this._oDetailNav.backToPage(p,i,t);}};h.prototype.insertPreviousPage=function(p,t,i){if(this._oMasterNav.getPage(p)){this._oMasterNav.insertPreviousPage(p,t,i);}else{this._oDetailNav.insertPreviousPage(p,t,i);}return this;};h.prototype.toMaster=function(p,t,i,T){this._oMasterNav.to(p,t,i,T);};h.prototype.backMaster=function(i,t){this._oMasterNav.back(i,t);};h.prototype.backMasterToPage=function(p,i,t){this._oMasterNav.backToPage(p,i,t);};h.prototype.toDetail=function(p,t,i,T){this._oDetailNav.to(p,t,i,T);};h.prototype.backDetail=function(i,t){this._oDetailNav.back(i,t);};h.prototype.backDetailToPage=function(p,i,t){this._oDetailNav.backToPage(p,i,t);};h.prototype.backToTopMaster=function(i,t){this._oMasterNav.backToTop(i,t);};h.prototype.backToTopDetail=function(i,t){this._oDetailNav.backToTop(i,t);};h.prototype.addMasterPage=function(p){if(this._hasPageInArray(this._aMasterPages,p)){return;}if(this._oMasterNav===this._oDetailNav&&this._oDetailNav.getPages()&&this._oDetailNav.getPages().indexOf(p)!==-1){this._removePageFromArray(this._aDetailPages,p);}this._oMasterNav.insertPage(p,this._aMasterPages.length);this._aMasterPages.push(p);return this;};h.prototype.addDetailPage=function(p){var t=this,r=this._getRealPage(p);if(this._hasPageInArray(this._aDetailPages,p)){return;}p.addDelegate({onBeforeShow:function(){if(r){if(!b.system.phone){if(t._needShowMasterButton()){t._setMasterButton(r);}}}}});if(r){r.addDelegate({onBeforeRendering:function(){if(!b.system.phone&&(t._oDetailNav.getCurrentPage()===r)){if(!r.getShowNavButton()&&t._needShowMasterButton()){t._setMasterButton(r,true);}else{t._removeMasterButton(r);}}}});if(!b.system.phone){if(!r._setCustomHeaderInSC){r._setCustomHeaderInSC=r.setCustomHeader;}r.setCustomHeader=function(H){this._setCustomHeaderInSC.apply(this,arguments);if(H&&t._needShowMasterButton()){t._setMasterButton(r);}return this;};if(!r._setShowNavButtonInSC){r._setShowNavButtonInSC=r.setShowNavButton;}r.setShowNavButton=function(s){this._setShowNavButtonInSC.apply(this,arguments);if(!s&&t._needShowMasterButton()){t._setMasterButton(r);}else{t._removeMasterButton(r,true);}return this;};}}if(this._oMasterNav===this._oDetailNav&&this._oMasterNav.getPages()&&this._oMasterNav.getPages().indexOf(p)!==-1){this._removePageFromArray(this._aMasterPages,p);}this._oDetailNav.addPage(p);this._aDetailPages.push(p);return this;};h.prototype.getMasterPages=function(){return this._aMasterPages.slice();};h.prototype.getDetailPages=function(){return this._aDetailPages.slice();};h.prototype.indexOfMasterPage=function(p){return this._indexOfMasterPage(p);};h.prototype.indexOfDetailPage=function(p){return this._indexOfDetailPage(p);};h.prototype.insertMasterPage=function(p,i,s){return this._insertPage(this._aMasterPages,"masterPages",p,i,s);};h.prototype.removeMasterPage=function(p,s){return this._removePage(this._aMasterPages,"masterPages",p,s);};h.prototype.removeAllMasterPages=function(s){this._aMasterPages=[];return this.removeAllAggregation("masterPages",s);};h.prototype.insertDetailPage=function(p,i,s){return this._insertPage(this._aDetailPages,"detailPages",p,i,s);};h.prototype._restoreMethodsInPage=function(p){if(b.system.phone){return;}var r=this._getRealPage(p);if(r){if(r._setCustomHeaderInSC){r.setCustomHeader=r._setCustomHeaderInSC;delete r._setCustomHeaderInSC;}if(r._setShowNavButtonInSC){r.setShowNavButton=r._setShowNavButtonInSC;delete r._setShowNavButtonInSC;}}};h.prototype.removeDetailPage=function(p,s){this._restoreMethodsInPage(p);return this._removePage(this._aDetailPages,"detailPages",p,s);};h.prototype.removeAllDetailPages=function(s){var p=this.getDetailPages();for(var i=0;i<p.length;i++){this._restoreMethodsInPage(p[i]);}this._aDetailPages=[];return this.removeAllAggregation("detailPages",s);};h.prototype.addPage=function(p,m){if(m){return this.addMasterPage(p);}else{return this.addDetailPage(p);}};h.prototype.showMaster=function(){var t=this,_=this._getRealPage(this._oDetailNav.getCurrentPage());function i(){this._oPopOver.detachAfterOpen(i,this);this._bMasterOpening=false;this._bMasterisOpen=true;this.fireAfterMasterOpen();}if(this._portraitPopover()){if(!this._oPopOver.isOpen()){this._oPopOver.attachAfterOpen(i,this);this.fireBeforeMasterOpen();this._oPopOver.openBy(this._oShowMasterBtn,true);this._bMasterOpening=true;}}else if((this._portraitHide()||this._hideMode())&&(!this._bMasterisOpen||this._bMasterClosing)){this._oMasterNav.$().one("webkitTransitionEnd transitionend",q.proxy(this._afterShowMasterAnimation,this));this.fireBeforeMasterOpen();this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterVisible",true);this._oMasterNav.getDomRef()&&this._oMasterNav.getDomRef().offsetHeight;this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterHidden",false);this._bMasterOpening=true;t._removeMasterButton(_);if(b.browser.webkit){var m=this._oMasterNav;window.setTimeout(function(){m.$().css("box-shadow","none");window.setTimeout(function(){m.$().css("box-shadow","");},50);},0);}}return this;};h.prototype.hideMaster=function(){if(this._portraitPopover()){if(this._oPopOver.isOpen()){this._oPopOver.close();this._bMasterClosing=true;}}else if((this._portraitHide()||this._hideMode())&&(this._bMasterisOpen||this._oMasterNav.$().hasClass("sapMSplitContainerMasterVisible"))){this._oMasterNav.$().one("webkitTransitionEnd transitionend",q.proxy(this._afterHideMasterAnimation,this));this.fireBeforeMasterClose();this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterVisible",false);this._oMasterNav.getDomRef()&&this._oMasterNav.getDomRef().offsetHeight;this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterHidden",true);this._bMasterClosing=true;}return this;};h.prototype._afterShowMasterAnimation=function(){if(this._portraitHide()||this._hideMode()){this._bMasterOpening=false;this._bMasterisOpen=true;this.fireAfterMasterOpen();}};h.prototype._afterHideMasterAnimation=function(){var o=this._getRealPage(this._oDetailNav.getCurrentPage());this._setMasterButton(o);this._bMasterClosing=false;this._bMasterisOpen=false;if(d(this._oMasterNav.getDomRef(),document.activeElement)){document.activeElement.blur();}this.fireAfterMasterClose();};h.prototype.getCurrentMasterPage=function(){return this._oMasterNav.getCurrentPage();};h.prototype.getCurrentDetailPage=function(){return this._oDetailNav.getCurrentPage();};h.prototype.getCurrentPage=function(m){if(m){return this.getCurrentMasterPage();}else{return this.getCurrentDetailPage();}};h.prototype.getPreviousPage=function(m){if(m){return this._oMasterNav.getPreviousPage();}else{return this._oDetailNav.getPreviousPage();}};h.prototype.getMasterPage=function(p){return this._oMasterNav.getPage(p);};h.prototype.getDetailPage=function(p){return this._oDetailNav.getPage(p);};h.prototype.getPage=function(p,m){if(m){return this.getMasterPage(p);}else{return this.getDetailPage(p);}};h.prototype.isMasterShown=function(){if(b.system.phone){var o=this._oMasterNav.getCurrentPage();return this._indexOfMasterPage(o)!==-1;}else{var m=this.getMode();switch(m){case g.StretchCompressMode:return true;case g.HideMode:return this._bMasterisOpen;case g.PopoverMode:case g.ShowHideMode:return b.orientation.landscape||this._bMasterisOpen;default:return false;}}};h.prototype.setBackgroundOpacity=function(o){if(o>1||o<0){L.warning("Invalid value "+o+" for SplitContainer.setBackgroundOpacity() ignored. Valid values are: floats between 0 and 1.");return this;}return this.setProperty("backgroundOpacity",o);};h.prototype.setMode=function(m){var o=this.getMode();if(o===m){return this;}this.setProperty("mode",m,true);if(b.system.phone||!this.getDomRef()){return this;}if(o==="HideMode"&&this._oldIsLandscape){this._removeMasterButton(this._oDetailNav.getCurrentPage());}var i=this.getDomRef();if(m!=="PopoverMode"&&this._oPopOver.getContent().length>0){this._updateMasterPosition("landscape");}else if(m=="PopoverMode"){if(!this._oldIsLandscape){if(this._oPopOver.getContent().length===0){this._updateMasterPosition("popover");}this._setMasterButton(this._oDetailNav.getCurrentPage());}i.classList.remove("sapMSplitContainerShowHide");i.classList.remove("sapMSplitContainerStretchCompress");i.classList.remove("sapMSplitContainerHideMode");i.classList.add("sapMSplitContainerPopover");}if(m=="StretchCompressMode"){i.classList.remove("sapMSplitContainerShowHide");i.classList.remove("sapMSplitContainerPopover");i.classList.remove("sapMSplitContainerHideMode");i.classList.add("sapMSplitContainerStretchCompress");this._removeMasterButton(this._oDetailNav.getCurrentPage());}if(m=="ShowHideMode"){i.classList.remove("sapMSplitContainerPopover");i.classList.remove("sapMSplitContainerStretchCompress");i.classList.remove("sapMSplitContainerHideMode");i.classList.add("sapMSplitContainerShowHide");if(!b.orientation.landscape){this._setMasterButton(this._oDetailNav.getCurrentPage());}}if(m==="HideMode"){i.classList.remove("sapMSplitContainerPopover");i.classList.remove("sapMSplitContainerStretchCompress");i.classList.remove("sapMSplitContainerShowHide");i.classList.add("sapMSplitContainerHideMode");this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterVisible",false);this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterHidden",true);this._bMasterisOpen=false;this._setMasterButton(this._oDetailNav.getCurrentPage());}return this;};h.prototype._updateMasterInitialPage=function(){if(this.getMode()==="HideMode"&&b.system.phone&&this._aDetailPages){this._oMasterNav.setInitialPage(this.getInitialDetail()?this.getInitialDetail():(this.getInitialMaster()||this._aDetailPages[0]));}};h.prototype._indexOfMasterPage=function(p){return this._aMasterPages.indexOf(p);};h.prototype._indexOfDetailPage=function(p){return this._aDetailPages.indexOf(p);};h.prototype._insertPage=function(p,A,o,j,s){this.insertAggregation(A,o,j,s);var i;if(j<0){i=0;}else if(j>p.length){i=p.length;}else{i=j;}var O=(p?Array.prototype.indexOf.call(p,o):-1);p.splice(i,0,o);if(O!=-1){this._removePageFromArray(p,o);}return this;};h.prototype._removePage=function(p,A,o,s){var r=this.removeAggregation(A,o,s);if(r){this._removePageFromArray(p,r);}return r;};h.prototype._removePageFromArray=function(p,o){var i=(p?Array.prototype.indexOf.call(p,o):-1);if(i!=-1){p.splice(i,1);if(p===this._aDetailPages){this._restoreMethodsInPage(o);}}};h.prototype._handleNavigationEvent=function(E,A,m){var s=(A?"After":"")+(m?"Master":"Detail")+"Navigate",i;s=s.charAt(0).toLowerCase()+s.slice(1);i=this.fireEvent(s,E.mParameters,true);if(!i){E.preventDefault();}};h.prototype._handleResize=function(){var i=b.orientation.landscape,_=this._oDetailNav.getCurrentPage(),m=this.getMode();if(this._oldIsLandscape!==i){this._oldIsLandscape=i;if(!b.system.phone){this.$().toggleClass("sapMSplitContainerPortrait",!i);if(m==="HideMode"){return;}if(m==="ShowHideMode"){if(i){this.fireBeforeMasterOpen();}else{this.fireBeforeMasterClose();}}if(m==="ShowHideMode"||m==="PopoverMode"){this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterVisible",i);this._oMasterNav.toggleStyleClass("sapMSplitContainerMasterHidden",!i);}if(m==="ShowHideMode"){if(i){this._bMasterisOpen=true;this.fireAfterMasterOpen();}else{this._bMasterisOpen=false;this.fireAfterMasterClose();}}if(m=="PopoverMode"){if(this._oPopOver.isOpen()){this._oPopOver.attachAfterClose(this._handlePopClose,this);this._oPopOver.close();}else{this._handlePopClose();}}_=this._getRealPage(_);if(!this._oldIsLandscape&&m!="StretchCompressMode"){this._setMasterButton(_);}else{this._removeMasterButton(_);}}if(this._onOrientationChange){this._onOrientationChange();}}};h.prototype._handlePopClose=function(E){this._oPopOver.detachAfterClose(this._handlePopClose,this);if(this._oldIsLandscape){this._updateMasterPosition("landscape");}else{this._updateMasterPosition("popover");}};h.prototype._getRealPage=function(p){var r=p,i;while(r){if(r instanceof sap.m.Page){return r;}if(r instanceof sap.m.MessagePage){return r;}if(r instanceof S){return r;}if(r instanceof sap.ui.core.mvc.View){i=r.getContent();if(i.length===1){r=i[0];continue;}}else if(r instanceof N){r=r.getCurrentPage();continue;}r=null;}return r;};h.prototype._updateMasterPosition=function(p){var t=this;if(p=="popover"){this.removeAggregation("_navMaster",this._oMasterNav,true);this._oMasterNav.$().remove();this._oPopOver.addContent(this._oMasterNav);this._bMasterisOpen=false;}if(p=="landscape"){var r=function(){t._oPopOver.removeAggregation("content",t._oMasterNav,false);t.setAggregation("_navMaster",t._oMasterNav,true);var $=t.$();if($[0]){var i=sap.ui.getCore().createRenderManager();i.renderControl(t._oMasterNav.addStyleClass("sapMSplitContainerMaster"));i.flush($[0],false,(t.$("BG")[0])?1:0);i.destroy();}};if(this._oPopOver.isOpen()){var A=function(){this._oPopOver.detachAfterClose(A,this);this._bMasterisOpen=false;r();};this._oPopOver.attachAfterClose(A,this);this._oPopOver.close();}else{r();}}};h.prototype._portraitHide=function(){if(!this._oldIsLandscape&&!b.system.phone&&this.getMode()==="ShowHideMode"){return true;}else{return false;}};h.prototype._portraitPopover=function(){if(!this._oldIsLandscape&&!b.system.phone&&this.getMode()==="PopoverMode"){return true;}else{return false;}};h.prototype._hideMode=function(){return this.getMode()==="HideMode"&&!b.system.phone;};h.prototype._needShowMasterButton=function(){return(this._portraitHide()||this._hideMode()||this._portraitPopover())&&(!this._bMasterisOpen||this._bMasterClosing);};h.prototype._updateMasterButtonTooltip=function(){if(!this._oShowMasterBtn){return;}var t=this.getMasterButtonTooltip();if(t){this._oShowMasterBtn.setTooltip(t);return;}var p=this._oMasterNav.getCurrentPage();if(p&&p.getTitle){var T=p.getTitle();if(T){T=T.replace(/[_0-9]+$/,'');t=this._rb.getText('SPLITCONTAINER_NAVBUTTON_TOOLTIP',T);}}if(!t){t=this._rb.getText('SPLITCONTAINER_NAVBUTTON_DEFAULT_TOOLTIP');}this._oShowMasterBtn.setTooltip(t);};h.prototype._createShowMasterButton=function(){if(this._oShowMasterBtn&&!this._oShowMasterBtn.bIsDestroyed){return;}this._oShowMasterBtn=new B(this.getId()+"-MasterBtn",{icon:I.getIconURI("menu2"),tooltip:this.getMasterButtonTooltip(),type:e.Default,press:q.proxy(this._onMasterButtonTap,this)}).addStyleClass("sapMSplitContainerMasterBtn");};h.prototype._setMasterButton=function(p,j,s){if(!p){return;}if(typeof j==='boolean'){s=j;j=undefined;}p=this._getRealPage(p);if(!p){return;}var H=h._getHeaderButtonAggregation(p),k=H.sAggregationName,m=H.aAggregationContent;for(var i=0;i<m.length;i++){if(m[i]instanceof sap.m.Button&&m[i].getVisible()&&(m[i].getType()==e.Back||(m[i].getType()==e.Up&&m[i]!==this._oShowMasterBtn))){this._bDetailNavButton=true;return;}}this._bDetailNavButton=false;var o=p._getAnyHeader();var n=false;for(var i=0;i<m.length;i++){if(m[i]===this._oShowMasterBtn){n=true;}}if(!n){this._createShowMasterButton();this._updateMasterButtonTooltip();this._oShowMasterBtn.removeStyleClass("sapMSplitContainerMasterBtnHidden");if(o){o.insertAggregation(k,this._oShowMasterBtn,0,s);}}else{this._oShowMasterBtn.$().parent().toggleClass("sapMSplitContainerMasterBtnHide",false);this._oShowMasterBtn.removeStyleClass("sapMSplitContainerMasterBtnHidden");this._oShowMasterBtn.$().parent().toggleClass("sapMSplitContainerMasterBtnShow",true);}if(j){j(p);}this.fireMasterButton({show:true});};h._getHeaderButtonAggregation=function(p){var H=p._getAnyHeader(),A,s;if(!H){return;}if(H.getContentLeft){A=H.getContentLeft();s="contentLeft";}if(H.getContent){A=H.getContent();s="content";}return{aAggregationContent:A,sAggregationName:s};};h.prototype._removeMasterButton=function(p,j,n){if(!p){return;}var t=this,H=this._oShowMasterBtn.$().is(":hidden"),o;if(typeof j==="boolean"){n=j;j=undefined;}if(!H&&!n){p=this._getRealPage(p);if(!p){return;}o=p._getAnyHeader();if(o){var k=h._getHeaderButtonAggregation(p).aAggregationContent;for(var i=0;i<k.length;i++){if(k[i]===this._oShowMasterBtn){this._oShowMasterBtn.destroy();this._oShowMasterBtn.$().parent().on("webkitAnimationEnd animationend",function(){q(this).off("webkitAnimationEnd animationend");t._oShowMasterBtn.addStyleClass("sapMSplitContainerMasterBtnHidden");if(j){j(p);}});break;}}}this.fireMasterButton({show:false});}else{this._oShowMasterBtn.addStyleClass("sapMSplitContainerMasterBtnHidden");if(j){j(p);}if(!H){this.fireMasterButton({show:false});}}};h.prototype._callMethodInManagedObject=function(F,A){var i=Array.prototype.slice.call(arguments);if(A==="masterPages"){if(F==="indexOfAggregation"){return this._indexOfMasterPage.apply(this,i.slice(2));}else{return this._callNavContainerMethod(F,this._oMasterNav,i);}}else if(A==="detailPages"){if(F==="indexOfAggregation"){return this._indexOfDetailPage.apply(this,i.slice(2));}else{return this._callNavContainerMethod(F,this._oDetailNav,i);}}else{return M.prototype[F].apply(this,i.slice(1));}};h.prototype._callNavContainerMethod=function(F,n,A){A[1]="pages";A=A.slice(1);var r=h._mFunctionMapping[F];if(r){A.shift();F=r;}return n[F].apply(n,A);};h.prototype._hasPageInArray=function(i,p){return i.some(function(A){return p&&(p===A);});};h.prototype.validateAggregation=function(A,o,m){return this._callMethodInManagedObject("validateAggregation",A,o,m);};h.prototype.setAggregation=function(A,o,s){this._callMethodInManagedObject("setAggregation",A,o,s);return this;};h.prototype.getAggregation=function(A,o){return this._callMethodInManagedObject("getAggregation",A,o);};h.prototype.indexOfAggregation=function(A,o){return this._callMethodInManagedObject("indexOfAggregation",A,o);};h.prototype.insertAggregation=function(A,o,i,s){this._callMethodInManagedObject("insertAggregation",A,o,i,s);return this;};h.prototype.addAggregation=function(A,o,s){this._callMethodInManagedObject("addAggregation",A,o,s);return this;};h.prototype.removeAggregation=function(A,o,s){return this._callMethodInManagedObject("removeAggregation",A,o,s);};h.prototype.removeAllAggregation=function(A,s){return this._callMethodInManagedObject("removeAllAggregation",A,s);};h.prototype.destroyAggregation=function(A,s){this._callMethodInManagedObject("destroyAggregation",A,s);return this;};h._mFunctionMapping={"getAggregation":"getPage","addAggregation":"addPage","insertAggregation":"insertPage","removeAggregation":"removePage","removeAllAggregation":"removeAllPages"};return h;});

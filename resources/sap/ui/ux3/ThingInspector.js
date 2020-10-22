/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ActionBar','./Overlay','./ThingViewer','./ThingInspectorRenderer','./library','./ThingAction','sap/ui/dom/jquery/Selectors','sap/ui/dom/jquery/Focusable'],function(A,O,T,a,l,b){"use strict";var c=l.ActionBarSocialActions;var d=l.ThingViewerHeaderType;var F=l.FollowActionState;var e=O.extend("sap.ui.ux3.ThingInspector",{metadata:{library:"sap.ui.ux3",properties:{firstTitle:{type:"string",group:"Misc",defaultValue:null},type:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},secondTitle:{type:"string",group:"Misc",defaultValue:null},followState:{type:"sap.ui.ux3.FollowActionState",group:"Misc",defaultValue:F.Default},flagState:{type:"boolean",group:"Misc",defaultValue:false},favoriteState:{type:"boolean",group:"Misc",defaultValue:false},favoriteActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},updateActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},followActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},flagActionEnabled:{type:"boolean",group:"Misc",defaultValue:true},headerType:{type:"sap.ui.ux3.ThingViewerHeaderType",group:"Misc",defaultValue:d.Standard}},aggregations:{actions:{type:"sap.ui.ux3.ThingAction",multiple:true,singularName:"action"},headerContent:{type:"sap.ui.ux3.ThingGroup",multiple:true,singularName:"headerContent"},facets:{type:"sap.ui.ux3.NavigationItem",multiple:true,singularName:"facet"},facetContent:{type:"sap.ui.ux3.ThingGroup",multiple:true,singularName:"facetContent"},actionBar:{type:"sap.ui.ux3.ActionBar",multiple:false},thingViewer:{type:"sap.ui.ux3.ThingViewer",multiple:false,visibility:"hidden"}},associations:{selectedFacet:{type:"sap.ui.ux3.NavigationItem",multiple:false}},events:{actionSelected:{parameters:{id:{type:"string"},action:{type:"sap.ui.ux3.ThingAction"}}},facetSelected:{allowPreventDefault:true,parameters:{id:{type:"string"},item:{type:"sap.ui.ux3.NavigationItem"},key:{type:"string"}}},feedSubmit:{parameters:{text:{type:"string"}}}}}});e.prototype.init=function(){var o,t=this;O.prototype.init.apply(this);this._oThingViewer=new T(this.getId()+"-thingViewer");this.setAggregation("thingViewer",this._oThingViewer);this._oThingViewer.attachFacetSelected(function(E){var i=E.getParameters().item;if(t.fireFacetSelected({id:i.getId(),key:i.getKey(),item:i})){t.setSelectedFacet(i);}else{E.preventDefault();}});this._oSocialActions={};if(this.getActionBar()==null){o=new A(this.getId()+"-actionBar");o.setShowOpen(false);o.setAlwaysShowMoreMenu(false);o.setDividerWidth("252px");o.attachActionSelected(function(E){var s=E.getParameters().id,B=E.getParameters().action,f;if(s.indexOf(c.Favorite)!==-1||s.indexOf(c.Follow)!==-1||s.indexOf(c.Flag)!==-1){if(t._oSocialActions[s]){f=t._oSocialActions[s];}else{f=new b({id:t.getId()+"-"+s.toLowerCase(),text:B.text,enabled:B.enabled});t._oSocialActions[s]=f;}t.fireActionSelected({id:s.toLowerCase(),action:f});}else{t.fireActionSelected({id:E.getParameters().id,action:E.getParameters().action});}});o.attachFeedSubmit(function(E){t.fireFeedSubmit({text:E.getParameters().text});});this.setActionBar(o);}};e.prototype.onAfterRendering=function(){O.prototype.onAfterRendering.apply(this,arguments);var s=this._getShell();this._bShell=!!s;if(!s){this._applyChanges({showOverlay:false});}};e.prototype.onBeforeRendering=function(){O.prototype.onBeforeRendering.apply(this,arguments);};e.prototype.exit=function(){this._oThingViewer.exit(arguments);this._oThingViewer.destroy();this._oThingViewer=null;O.prototype.exit.apply(this,arguments);};e.prototype.open=function(i){if(this.getDomRef()){this.rerender();}O.prototype.open.apply(this,arguments);this._selectDefault();};e.prototype._getNavBar=function(){return this._oThingViewer._oNavBar;};e.prototype._selectDefault=function(){this._oThingViewer._selectDefault();};e.prototype._equalColumns=function(){this._oThingViewer._equalColumns();};e.prototype._setTriggerValue=function(){this._oThingViewer._setTriggerValue();};e.prototype._setFocusLast=function(){var f=this.$("thingViewer-toolbar").lastFocusableDomRef();if(!f&&this.getCloseButtonVisible()&&this.$("close").is(":sapFocusable")){f=this.getDomRef("close");}else if(!f&&this.getOpenButtonVisible()&&this.$("openNew").is(":sapFocusable")){f=this.getDomRef("openNew");}if(f){f.focus();}};e.prototype._setFocusFirst=function(){if(this.getOpenButtonVisible()&&this.$("openNew").is(":sapFocusable")){if(this.getDomRef("openNew")){this.getDomRef("openNew").focus();}}else if(this.getCloseButtonVisible()&&this.$("close").is(":sapFocusable")){if(this.getDomRef("close")){this.getDomRef("close").focus();}}else{if(this.$("thingViewer-content").firstFocusableDomRef()){this.$("thingViewer-content").firstFocusableDomRef().focus();}}};e.prototype.insertAction=function(o,i){if(this.getActionBar()){this.getActionBar().insertBusinessAction(o,i);}return this;};e.prototype.addAction=function(o){if(this.getActionBar()){this.getActionBar().addBusinessAction(o);}return this;};e.prototype.removeAction=function(o){var r;if(this.getActionBar()){r=this.getActionBar().removeBusinessAction(o);}return r;};e.prototype.removeAllActions=function(){var r;if(this.getActionBar()){r=this.getActionBar().removeAllBusinessActions();}return r;};e.prototype.getActions=function(){var r;if(this.getActionBar()){r=this.getActionBar().getBusinessActions();}return r;};e.prototype.destroyActions=function(){if(this.getActionBar()){this.getActionBar().destroyBusinessActions();}return this;};e.prototype.indexOfAction=function(o){var r=-1;if(this.getActionBar()){r=this.getActionBar().indexOfBusinessAction(o);}return r;};e.prototype.getFacets=function(){return this._oThingViewer.getFacets();};e.prototype.insertFacet=function(f,i){this._oThingViewer.insertFacet(f,i);return this;};e.prototype.addFacet=function(f){this._oThingViewer.addFacet(f);return this;};e.prototype.removeFacet=function(E){return this._oThingViewer.removeFacet(E);};e.prototype.removeAllFacets=function(){return this._oThingViewer.removeAllFacets();};e.prototype.destroyFacets=function(){this._oThingViewer.destroyFacets();return this;};e.prototype.indexOfFacet=function(f){return this._oThingViewer.indexOfFacet(f);};e.prototype.setFollowState=function(f){if(this.getActionBar()){this.getActionBar().setFollowState(f);}return this;};e.prototype.getFollowState=function(){var r=null;if(this.getActionBar()){r=this.getActionBar().getFollowState();}return r;};e.prototype.setFlagState=function(f){if(this.getActionBar()){this.getActionBar().setFlagState(f);}return this;};e.prototype.getFlagState=function(){var r=null;if(this.getActionBar()){r=this.getActionBar().getFlagState();}return r;};e.prototype.setFavoriteState=function(f){if(this.getActionBar()){this.getActionBar().setFavoriteState(f);}return this;};e.prototype.getFavoriteState=function(){var r=null;if(this.getActionBar()){r=this.getActionBar().getFavoriteState();}return r;};e.prototype.setIcon=function(i){this._oThingViewer.setIcon(i);if(this.getActionBar()){this.getActionBar().setThingIconURI(i);}return this;};e.prototype.getIcon=function(){return this._oThingViewer.getIcon();};e.prototype.setType=function(t){this._oThingViewer.setType(t);return this;};e.prototype.getType=function(){return this._oThingViewer.getType();};e.prototype.insertFacetContent=function(f,i){this._oThingViewer.insertFacetContent(f,i);return this;};e.prototype.addFacetContent=function(f){this._oThingViewer.addFacetContent(f);return this;};e.prototype.removeFacetContent=function(f){var r=this._oThingViewer.removeFacetContent(f);return r;};e.prototype.removeAllFacetContent=function(){var r=this._oThingViewer.removeAllFacetContent();return r;};e.prototype.destroyFacetContent=function(){this._oThingViewer.destroyFacetContent();return this;};e.prototype.getFacetContent=function(){return this._oThingViewer.getFacetContent();};e.prototype.indexOfFacetContent=function(f){return this._oThingViewer.indexOfFacetContent(f);};e.prototype.setActionBar=function(o){this._oThingViewer.setActionBar(o);return this;};e.prototype.getActionBar=function(){return this._oThingViewer.getActionBar();};e.prototype.destroyActionBar=function(){this._oThingViewer.destroyActionBar();return this;};e.prototype.insertHeaderContent=function(h,i){this._oThingViewer.insertHeaderContent(h,i);return this;};e.prototype.addHeaderContent=function(h){this._oThingViewer.addHeaderContent(h);return this;};e.prototype.getHeaderContent=function(){return this._oThingViewer.getHeaderContent();};e.prototype.removeHeaderContent=function(h){var r=this._oThingViewer.removeHeaderContent(h);return r;};e.prototype.removeAllHeaderContent=function(){var r=this._oThingViewer.removeAllHeaderContent();return r;};e.prototype.destroyHeaderContent=function(){this._oThingViewer.destroyHeaderContent();return this;};e.prototype.indexOfHeaderContent=function(h){return this._oThingViewer.indexOfHeaderContent(h);};e.prototype.setSelectedFacet=function(s){this._oThingViewer.setSelectedFacet(s);return this;};e.prototype.getSelectedFacet=function(s){return this._oThingViewer.getSelectedFacet();};e.prototype.setFavoriteActionEnabled=function(E){if(this.getActionBar()){this.getActionBar().setShowFavorite(E);}return this;};e.prototype.getFavoriteActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowFavorite();}return r;};e.prototype.setFlagActionEnabled=function(E){if(this.getActionBar()){this.getActionBar().setShowFlag(E);}return this;};e.prototype.getFlagActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowFlag();}return r;};e.prototype.setUpdateActionEnabled=function(E){if(this.getActionBar()){this.getActionBar().setShowUpdate(E);}return this;};e.prototype.getUpdateActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowUpdate();}return r;};e.prototype.setFollowActionEnabled=function(E){if(this.getActionBar()){this.getActionBar().setShowFollow(E);}return this;};e.prototype.getFollowActionEnabled=function(){var r;if(this.getActionBar()){r=this.getActionBar().getShowFollow();}return r;};e.prototype.setFirstTitle=function(t){this._oThingViewer.setTitle(t);return this;};e.prototype.getFirstTitle=function(){return this._oThingViewer.getTitle();};e.prototype.setSecondTitle=function(t){this._oThingViewer.setSubtitle(t);return this;};e.prototype.getSecondTitle=function(){return this._oThingViewer.getSubtitle();};e.prototype.setHeaderType=function(h){this._oThingViewer.setHeaderType(h);return this;};e.prototype.getHeaderType=function(){var r=this._oThingViewer.getHeaderType();return r;};e.prototype._applyChanges=function(C){this.oChanges=C;if(C.showOverlay){this.$().removeClass("sapUiUx3TINoFrame");}else{this.$().addClass("sapUiUx3TINoFrame");}return this;};return e;});

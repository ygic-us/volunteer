/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Button','./Dialog','./Text','./FormattedText','./Link','./VBox','sap/ui/core/IconPool','sap/ui/core/ElementMetadata','sap/ui/core/library','sap/ui/core/Control','sap/m/library',"sap/ui/thirdparty/jquery",'sap/ui/core/theming/Parameters'],function(B,D,T,F,L,V,I,E,c,C,l,q,P){"use strict";var a=l.DialogType;var b=l.DialogRoleType;var d=c.TextDirection;var e=l.ButtonType;var M={};M.Action={OK:"OK",CANCEL:"CANCEL",YES:"YES",NO:"NO",ABORT:"ABORT",RETRY:"RETRY",IGNORE:"IGNORE",CLOSE:"CLOSE",DELETE:"DELETE"};M.Icon={NONE:undefined,INFORMATION:"INFORMATION",WARNING:"WARNING",ERROR:"ERROR",SUCCESS:"SUCCESS",QUESTION:"QUESTION"};(function(){var A=M.Action,f=M.Icon;var _=function(){if(M._rb!==sap.ui.getCore().getLibraryResourceBundle("sap.m")){M._rb=sap.ui.getCore().getLibraryResourceBundle("sap.m");}};M.show=function(m,o){var g,h,v,r=null,j=[],i,s,t,k,n,p,u,w={id:E.uid("mbox"),initialFocus:null,textDirection:d.Inherit,verticalScrolling:true,horizontalScrolling:true,details:"",contentWidth:null},x=P.get("_sap_m_Message_Box_Information_Icon")==="true",S=x?"message-information":"hint",y={"INFORMATION":"sapMMessageBoxInfo","WARNING":"sapMMessageBoxWarning","ERROR":"sapMMessageBoxError","SUCCESS":"sapMMessageBoxSuccess","QUESTION":"sapMMessageBoxQuestion","STANDARD":"sapMMessageBoxStandard"},z={"INFORMATION":I.getIconURI(S),"WARNING":I.getIconURI("message-warning"),"ERROR":I.getIconURI("message-error"),"SUCCESS":I.getIconURI("message-success"),"QUESTION":I.getIconURI("question-mark")};_();if(typeof o==="string"||arguments.length>2){s=arguments[1];t=arguments[2];k=arguments[3];n=arguments[4];p=arguments[5];u=arguments[6];o={icon:s,title:t,actions:k,onClose:n,id:p,styleClass:u};}if(o&&o.hasOwnProperty("details")){w.icon=f.INFORMATION;w.emphasizedAction=A.OK;w.actions=[A.OK,A.CANCEL];o=q.extend({},w,o);}o=q.extend({},w,o);if(typeof o.actions!=="undefined"&&!Array.isArray(o.actions)){if(o.emphasizedAction!==null){o.emphasizedAction=o.actions;}o.actions=[o.actions];}if(!o.actions||o.actions.length===0){o.emphasizedAction=A.OK;o.actions=[A.OK];}function G(O,H){var Q;if(M.Action.hasOwnProperty(O)){Q=M._rb.getText("MSGBOX_"+O);}var R=new B({id:E.uid("mbox-btn-"),text:Q||O,type:H,press:function(){r=O;g.close();}});return R;}var H;for(i=0;i<o.actions.length;i++){H=o.emphasizedAction===o.actions[i]?e.Emphasized:e.Default;j.push(G(o.actions[i],H));}function J(o,h){var O,Q,R=new V({items:[h]});if(!o.details){return R;}if(typeof o.details=='object'){o.details="<pre>"+JSON.stringify(o.details,null,'\t').replace(/{/gi,"\\{")+"</pre>";}O=new F().setVisible(false).setHtmlText(o.details);Q=new L({text:M._rb.getText("MSGBOX_LINK_TITLE"),press:function(){var U=g.getInitialFocus();g.addAriaLabelledBy(O);O.setVisible(true);Q.setVisible(false);g._setInitialFocus();if(!U||U===Q.getId()){j[0].focus();}}});Q.addStyleClass("sapMMessageBoxLinkText");O.addStyleClass("sapMMessageBoxDetails");R.addItem(Q);R.addItem(O);return R;}function K(){if(typeof o.onClose==="function"){o.onClose(r);}g.detachAfterClose(K);g.destroy();}function N(){var i=0;var O=null;if(o.initialFocus){if(o.initialFocus instanceof C){O=o.initialFocus;}if(typeof o.initialFocus==="string"){for(i=0;i<j.length;i++){if(M.Action.hasOwnProperty(o.initialFocus)){if(M._rb.getText("MSGBOX_"+o.initialFocus).toLowerCase()===j[i].getText().toLowerCase()){O=j[i];break;}}else{if(o.initialFocus.toLowerCase()===j[i].getText().toLowerCase()){O=j[i];break;}}}}}return O;}if(typeof(m)==="string"){v=new T({textDirection:o.textDirection}).setText(m).addStyleClass("sapMMsgBoxText");h=v;}else if(m instanceof C){v=m.addStyleClass("sapMMsgBoxText");}if(o&&o.hasOwnProperty("details")&&o.details!==""){v=J(o,v);}g=new D({id:o.id,type:a.Message,title:o.title,content:v,icon:z[o.icon],initialFocus:N(),verticalScrolling:o.verticalScrolling,horizontalScrolling:o.horizontalScrolling,afterClose:K,buttons:j,ariaLabelledBy:h?h.getId():undefined,contentWidth:o.contentWidth,closeOnNavigation:o.closeOnNavigation}).addStyleClass("sapMMessageBox");g.setProperty("role",b.AlertDialog);if(y[o.icon]){g.addStyleClass(y[o.icon]);}else{g.addStyleClass(y.STANDARD);}if(o.styleClass){g.addStyleClass(o.styleClass);}g.open();};M.alert=function(m,o){_();var g={icon:f.NONE,title:M._rb.getText("MSGBOX_TITLE_ALERT"),emphasizedAction:o&&o.actions?null:A.OK,actions:A.OK,id:E.uid("alert"),initialFocus:null},h,t,s,S;if(typeof o==="function"||arguments.length>2){h=arguments[1];t=arguments[2];s=arguments[3];S=arguments[4];o={onClose:h,title:t,id:s,styleClass:S};}o=q.extend({},g,o);return M.show(m,o);};M.confirm=function(m,o){_();var g={icon:f.QUESTION,title:M._rb.getText("MSGBOX_TITLE_CONFIRM"),emphasizedAction:o&&o.actions?null:A.OK,actions:[A.OK,A.CANCEL],id:E.uid("confirm"),initialFocus:null},h,t,s,S;if(typeof o==="function"||arguments.length>2){h=arguments[1];t=arguments[2];s=arguments[3];S=arguments[4];o={onClose:h,title:t,id:s,styleClass:S};}o=q.extend({},g,o);return M.show(m,o);};M.error=function(m,o){_();var g={icon:f.ERROR,title:M._rb.getText("MSGBOX_TITLE_ERROR"),emphasizedAction:null,actions:A.CLOSE,id:E.uid("error"),initialFocus:null};o=q.extend({},g,o);return M.show(m,o);};M.information=function(m,o){_();var g={icon:f.INFORMATION,title:M._rb.getText("MSGBOX_TITLE_INFO"),emphasizedAction:o&&o.actions?null:A.OK,actions:A.OK,id:E.uid("info"),initialFocus:null};o=q.extend({},g,o);return M.show(m,o);};M.warning=function(m,o){_();var g={icon:f.WARNING,title:M._rb.getText("MSGBOX_TITLE_WARNING"),emphasizedAction:o&&o.actions?null:A.OK,actions:A.OK,id:E.uid("warning"),initialFocus:null};o=q.extend({},g,o);return M.show(m,o);};M.success=function(m,o){_();var g={icon:f.SUCCESS,title:M._rb.getText("MSGBOX_TITLE_SUCCESS"),emphasizedAction:o&&o.actions?null:A.OK,actions:A.OK,id:E.uid("success"),initialFocus:null};o=q.extend({},g,o);return M.show(m,o);};}());return M;},true);

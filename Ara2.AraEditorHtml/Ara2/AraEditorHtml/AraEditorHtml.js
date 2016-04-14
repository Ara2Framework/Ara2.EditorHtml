// Copyright (c) 2010-2016, Rafael Leonel Pontani. All rights reserved.
// For licensing, see LICENSE.md or http://www.araframework.com.br/license
// This file is part of AraFramework project details visit http://www.arafrework.com.br
// AraFramework - Rafael Leonel Pontani, 2016-4-14
Ara.AraClass.Add('AraEditorHtml', function (vAppId, vId, ConteinerFather) {
    

    // Eventos  ---------------------------------------
    this.Events = {};

    var TmpThis = this;
    this.Events.Click =
    {
        Enabled: false,
        SetEnabled: function (vValue) {
            var TmpThis2 = this;
            if (vValue && this.PrimeiraAtivacaoEvento != true) {
                $(TmpThis.Obj).bind('contextmenu click', function (e) { TmpThis2.Function(e); return false; });
                this.PrimeiraAtivacaoEvento = true;
            }

            this.Enabled = vValue;
        },
        ThreadType: 2, // Single_thread
        Function: function (event) {
            if (this.Enabled) {

                var vParans = {
                    Mouse_which: event.which,
                    Mouse_layerX: event.layerX,
                    Mouse_layerY: event.layerY,
                    Mouse_clientX: event.clientX,
                    Mouse_clientY: event.clientY,
                    Mouse_offsetX: event.offsetX,
                    Mouse_offsetY: event.offsetY,
                    Mouse_pageX: event.pageX,
                    Mouse_pageY: event.pageY,
                    Mouse_screenX: event.screenX,
                    Mouse_screenY: event.screenY,
                    Mouse_x: event.x,
                    Mouse_y: event.y,
                    Mouse_altKey: event.altKey,
                    Mouse_ctrlKey: event.ctrlKey,
                    Mouse_shiftKey: event.shiftKey
                };

                Ara.Tick.Send(this.ThreadType, TmpThis.AppId, TmpThis.id, "Click", vParans);
            }
        }
    };



    this.Events.PermissionToSend =
    {
        Enabled: false,
        ThreadType: 1, // Mult_thread
        Function: function (vFileId, vFileName) {
            if (TmpThis.Events.Click.PermissionToSend) {
                Ara.Tick.Send(this.ThreadType, TmpThis.AppId, TmpThis.id, "PermissionToSend", { FileId: vFileId, FileName: vFileName });
            }
        }
    };
    //---------------------------------------------------


    this.vSpan = "";
    this.vValorAntigo = "";
    this.vValorAntigo_class = "";

    this.ResponseUploadJson = function (vResponseJson) {
        this.ObjUploader._handler._options.AraReponse(vResponseJson);
    }

    this.Left = null;
    this.SetLeft = function (vTmp) {
        if (this.Left != vTmp) {
            this.Left = vTmp;
            this.Obj.style.left = vTmp;
        }
    }

    this.Top = null;
    this.SetTop = function (vTmp) {
        if (this.Top != vTmp) {
            this.Top = vTmp;
            this.Obj.style.top = vTmp;
        }
    }

    this.Width = null;
    this.SetWidth = function (vTmp,vServer) {
        if (this.Width != vTmp) {
            this.Width = vTmp;
            $("#" + this.id + "_text").width(vTmp);
            if (vServer) this.ControlVar.SetValueUtm('Width', this.Width);
            this.Obj.style.width = vTmp;
            if (this.Anchor != null)
                this.Anchor.RenderChildren();
        }
    }

    this.Height = null;
    this.SetHeight = function (vTmp, vServer) {
        if (this.Height != vTmp) {
            this.Height = vTmp;
            $("#" + this.id + "_text").height(vTmp);
            if (vServer) this.ControlVar.SetValueUtm('Height', this.Height);
            this.Obj.style.height = vTmp;

            var ckTopHeight = parseInt($(this.Obj).find(".cke_top").height(), 10) + 10;
            var ckbottom = parseInt($(this.Obj).find(".cke_bottom").height(), 10) + 10;

            if (!ckTopHeight)
                ckTopHeight = 66;

            if (!ckbottom)
                ckbottom = 20;

            $(this.Obj).find(".cke_contents").height((parseInt(vTmp, 10) - ckTopHeight - ckbottom) + "px");


            if (this.Anchor != null)
                this.Anchor.RenderChildren();
        }
    }

    this.SetCodeSnippetTheme = function (vTmp) {
        var vTmpThis = this;
        this.OnLoadAdd(function () { vTmpThis.SetCodeSnippetThemesynchronous(vTmp); });

    }

    this.SetCodeSnippetThemesynchronous = function (vTmp) {
        var vconfig = CKEDITOR.instances[this.id + "_text"].config;
        CKEDITOR.instances[this.id + "_text"].destroy();
        
        var RemuveCodeSnippet = false;
        var codeSnippet_theme=vTmp;
        if (vTmp == "none") 
        {
            RemuveCodeSnippet = true;
            codeSnippet_theme='';
        }
        

        if (!RemuveCodeSnippet) {
            var vAcho = false;

            if (vconfig.extraPlugins != "") {
                for (var vN in vconfig.extraPlugins.split(",")) {
                    if (vconfig.extraPlugins[vN] == "codesnippet") {
                        vAcho = true;
                        break;
                    }
                }
            }

            var extraPlugins = vconfig.extraPlugins;
            if (!vAcho) {
                if (extraPlugins!="")
                    extraPlugins = extraPlugins + ',codesnippet';
                else
                    extraPlugins = 'codesnippet';
            }


            CKEDITOR.replace(this.id + "_text", CKEDITOR.tools.extend({}, vconfig, {
                extraPlugins: extraPlugins,
                codeSnippet_theme: codeSnippet_theme
            }, true));
        }
        else {
            var extraPlugins = vconfig.extraPlugins.replace(",codesnippet", "").replace("codesnippet", "");
            
            CKEDITOR.replace(this.id + "_text", CKEDITOR.tools.extend({}, vconfig, {
                extraPlugins: extraPlugins
            }, true));
        }
        
    };



    this.SetVisible = function (vTmp) {
        if (vTmp)
            this.Obj.style.display = "block";
        else
            this.Obj.style.display = "none";
    }

    this.destruct = function () {
        $(this.Obj).remove();
    }

    this.IsDestroyed = function () {
        if (!document.getElementById(this.id))
            return true;
        else
            return false;
    }

    this.SetTypePosition = function (vTypePosition) {
        if (vTypePosition != "static")
            $(this.Obj).css({ position: vTypePosition });
        else {
            $(this.Obj).css({ position: "", left: "", top: "" });
        }
    }


    this.SetText = function (vValue, vServer) {
        if (vValue != "")
            CKEDITOR.instances[this.id + "_text"].setData(UTF8ArrToStr(base64DecToArr(vValue)));
        else
            CKEDITOR.instances[this.id + "_text"].setData("");

        if (vServer) this.ControlVar.SetValueUtm('GetText()', vValue);
    };

    this.GetText = function () {
        return base64EncArr(strToUTF8Arr(CKEDITOR.instances[this.id + "_text"].getData()));
    }

    this.IsLoad = false;

    this._OnLoad = new Array();
    this.OnLoadAdd = function (vFunc) {
        if (this.IsLoad)
            vFunc();
        else
            this._OnLoad.push(vFunc);
    }

    this.OnLoad = function () {
        for (var vN in this._OnLoad) {
            this._OnLoad[vN]();
        }
        this._OnLoad = new Array();
        this.IsLoad = true;
    }
    

    this.AppId = vAppId;
    this.id = vId;
    this.ConteinerFather = ConteinerFather;

    this.Obj = document.getElementById(this.id);
    if (!this.Obj) {
        alert("Object '" + this.id + "' Not Found");
        return;
    }

    //style='width:100%;height:100%;'
    $(this.Obj).css({ position: "absolute", top: "0px", left: "0px" });
    $(this.Obj).html("<textarea  id='" + this.id + "_text'   > </textarea >");

    
    /*
    var vTmpThis = this;
    $("#" + this.id + "_text").ckeditor(function () {
        var vTmpH = vTmpThis.Height;
        vTmpThis.Height = null;
        vTmpThis.SetHeight(vTmpH);
    });
    */
    

    var vTmpThis = this;
    CKEDITOR.on('instanceLoaded', function (evt) {
        var vTmpH = vTmpThis.Height;
        vTmpThis.Height = null;
        vTmpThis.SetHeight(vTmpH);
        vTmpThis.OnLoad();
    });

    $("#" + this.id + "_text").ckeditor();

    
    //$("#" + this.id + "_text").niceScroll({ zindex: 999988 });

    this.ControlVar = new ClassAraGenVarSend(this);
    this.ControlVar.AddPrototype("Top");
    this.ControlVar.AddPrototype("Left");
    this.ControlVar.AddPrototype("Width");
    this.ControlVar.AddPrototype("Height");
    this.ControlVar.AddPrototype("IsDestroyed()");
    this.ControlVar.AddPrototype("GetText()");

    this.Anchor = new ClassAraAnchor(this);
});
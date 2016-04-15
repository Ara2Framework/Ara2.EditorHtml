// Copyright (c) 2010-2016, Rafael Leonel Pontani. All rights reserved.
// For licensing, see LICENSE.md or http://www.araframework.com.br/license
// This file is part of AraFramework project details visit http://www.arafrework.com.br
// AraFramework - Rafael Leonel Pontani, 2016-4-14
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.IO;
using Ara2;
using Ara2.Components.Textbox;
using Ara2.Dev;
using System.Reflection;

namespace Ara2.Components
{
    [Serializable]
    [AraDevComponent(vConteiner:false)]
    public class AraEditorHtml : AraComponentVisualAnchorConteiner, IAraDev
    {

        public AraEditorHtml(IAraObject ConteinerFather)
            : this(AraObjectClienteServer.Create(ConteinerFather, "div"), ConteinerFather)
        {
            
        }
        public AraEditorHtml(string vId, IAraObject ConteinerFather)
            : base(vId, ConteinerFather, "AraEditorHtml")
        {
            Click = new AraComponentEvent<EventHandler>(this, "Click");
            this.EventInternal += this_EventInternal ;
            this.SetProperty += this_SetProperty;
            this.MinWidth = 150;
            this.MinHeight = 50;
            this.Width = 110;
            this.Height = 25;
        }


        [AraDevEvent]
        AraComponentEvent<EventHandler> Click;

        private static bool ArquivosHdCarregado=false;


        public override void LoadJS()
        {
            Tick vTick = Tick.GetTick();
            vTick.Session.AddJs("Ara2/Components/AraEditorHtml/files/Base64.js");
            vTick.Session.AddJs("Ara2/Components/AraEditorHtml/files/ckeditor_basepath.js");
            vTick.Session.AddJs("Ara2/Components/AraEditorHtml/files/ckeditor.js");
            vTick.Session.AddJs("Ara2/Components/AraEditorHtml/files/adapters/jquery.js");
            vTick.Session.AddJs("Ara2/Components/AraEditorHtml/AraEditorHtml.js");
        }


        public static void CodeSnippetStartTheme(ECodeSnippetTheme vCodeSnippetTheme = ECodeSnippetTheme.Default)
        {
            Tick vTick = Tick.GetTick();
            string vTmpNameCss = Enum.GetName(typeof(ECodeSnippetTheme), vCodeSnippetTheme).Replace("__", ".").Replace("_", "-").Replace("Default", "default");

            if (vTick.Page.Request.Browser.Type.ToUpper().Contains("IE") && vTick.Page.Request.Browser.MajorVersion <= 8)
            {
                //vTick.Session.AddCss("Ara2/Components/AraEditorHtml/files/plugins/codesnippet/lib/highlight_IEOLD/styles/" + vTmpNameCss + ".css");
                //vTick.Session.AddJs("Ara2/Components/AraEditorHtml/files/plugins/codesnippet/lib/highlight_IEOLD/highlight.js");
            }
            else
            {
                vTick.Session.AddCss("Ara2/Components/AraEditorHtml/files/plugins/codesnippet/lib/highlight/styles/" + vTmpNameCss + ".css");
                vTick.Session.AddJs("Ara2/Components/AraEditorHtml/files/plugins/codesnippet/lib/highlight/highlight.pack.js");
                vTick.Script.Send("$('pre code').each(function(i, e) {hljs.highlightBlock(e)});");
            }           
        }

        private void this_EventInternal(String vFunction)
        {
            switch (vFunction.ToUpper())
            {
                case "CLICK":
                    Click.InvokeEvent(this, new EventArgs());
                    break;
            }
        }

        private string _Text = "";
        [AraDevProperty("")]
        public string Text
        {
            get { return _Text; }
            set
            {
                _Text = value;

                this.TickScriptCall();
                Tick.GetTick().Script.Send(" vObj.SetText('" + AraTools.StringToStringJS(Convert.ToBase64String(Encoding.UTF8.GetBytes( _Text))) + "',true); \n");

            }
        }

        

        

        private void this_SetProperty(String vProperty, dynamic vValue)
        {
            if (vProperty == "GetText()")
                if (vValue==null)
                    _Text = "";
                else
                    _Text = Encoding.UTF8.GetString(Convert.FromBase64String(vValue.ToString()));
        }
        

        private bool _Enabled = true;
        [AraDevProperty(true)]
        public bool Enabled
        {
            get { return _Enabled; }
            set
            {
                _Enabled = value;
                
                this.TickScriptCall();
                Tick.GetTick().Script.Send(" vObj.SetEnabled(" + (_Enabled == true ? "true" : "false") + "); \n");
            }
        }

        public enum ECodeSnippetTheme
        {
            none,
            monokai_sublime,
            Default,
            arta,
            ascetic,
            atelier_dune__dark,
            atelier_dune__light,
            atelier_forest__dark,
            atelier_forest__light,
            atelier_heath__dark,
            atelier_heath__light,
            atelier_lakeside__dark,
            atelier_lakeside__light,
            atelier_seaside__dark,
            atelier_seaside__light,
            brown_paper,
            dark,
            docco,
            far,
            foundation,
            github,
            googlecode,
            idea,
            ir_black,
            magula,
            mono_blue,
            monokai,
            obsidian,
            paraiso__dark,
            paraiso__light,
            pojoaque,
            railscasts,
            rainbow,
            school_book,
            solarized_dark,
            solarized_light,
            sunburst,
            tomorrow_night_blue,
            tomorrow_night_bright,
            tomorrow_night_eighties,
            tomorrow_night,
            tomorrow,
            vs,
            xcode,
            zenburn
        }

        private ECodeSnippetTheme _CodeSnippetTheme = ECodeSnippetTheme.none;
        [AraDevProperty(ECodeSnippetTheme.none)]
        public ECodeSnippetTheme CodeSnippetTheme
        {
            get { return _CodeSnippetTheme; }
            set
            {
                _CodeSnippetTheme = value;

                this.TickScriptCall();
                Tick.GetTick().Script.Send(" vObj.SetCodeSnippetTheme('" + Enum.GetName(typeof(ECodeSnippetTheme), _CodeSnippetTheme).Replace("__", ".").Replace("_", "-").Replace("Default", "default") + "'); \n");

            }
        }

        #region Ara2Dev
        private string _Name = "";
        [AraDevProperty("")]
        public string Name
        {
            get { return _Name; }
            set { _Name = value; }
        }

        private AraEvent<DStartEditPropertys> _StartEditPropertys = null;
        public AraEvent<DStartEditPropertys> StartEditPropertys
        {
            get
            {
                if (_StartEditPropertys == null)
                {
                    _StartEditPropertys = new AraEvent<DStartEditPropertys>();
                    this.Click += this_ClickEdit;
                }

                return _StartEditPropertys;
            }
            set
            {
                _StartEditPropertys = value;
            }
        }
        private void this_ClickEdit(object sender, EventArgs e)
        {
            if (_StartEditPropertys.InvokeEvent != null)
                _StartEditPropertys.InvokeEvent(this);
        }

        private AraEvent<DStartEditPropertys> _ChangeProperty = new AraEvent<DStartEditPropertys>();
        public AraEvent<DStartEditPropertys> ChangeProperty
        {
            get
            {
                return _ChangeProperty;
            }
            set
            {
                _ChangeProperty = value;
            }
        }

        #endregion

        

    }
}

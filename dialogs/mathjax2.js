/**
 * @license Copyright (c) 2017 Peace Ngara
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add('mathjax2', function (editor) {

    var preview,
        lang = editor.lang.mathjax2;

    var mathjaxdoc = 'MathJax Documentation';
    var mathjaxuri = 'http://docs.mathjax.org';

    var about_uri = 'github.com/EonConsulting'
    var about_dev = 'EON Consulting Github'

    return {
        title: lang.title,
        minWidth: 450,
        minHeight: 150,
        contents: [
            {
                id: 'info',
                elements: [
                    {
                        id: 'MathInput',
                        type: 'textarea',
                        label: lang.dialogInput,

                        onLoad: function () {
                            var that = this;

                            if (!( CKEDITOR.env.ie && CKEDITOR.env.version == 8 )) {
                                this.getInputElement().on('keyup', function () {
                                    // Add \( and \) for preview.
                                    // preview.setValue(+that.getInputElement().getValue());
                                    var Preview = {
                                        delay: 150,        // delay after keystroke before updating
                                        preview: null,     // filled in by Init below
                                        buffer: null,      // filled in by Init below
                                        timeout: null,     // store setTimout id
                                        mjRunning: false,  // true when MathJax is processing
                                        mjPending: false,  // true when a typeset has been queued
                                        oldText: null,     // used to check if an update is needed
                                        //
                                        //  Get the preview and buffer DIV's
                                        //
                                        Init: function () {
                                            this.preview = document.getElementById("MathPreview");
                                            this.buffer = document.getElementById("MathBuffer");
                                        },

                                        //
                                        //  Switch the buffer and preview, and display the right one.
                                        //  (We use visibility:hidden rather than display:none since
                                        //  the results of running MathJax are more accurate that way.)
                                        //
                                        SwapBuffers: function () {
                                            var buffer = this.preview, preview = this.buffer;
                                            this.buffer = buffer;
                                            this.preview = preview;
                                            buffer.style.visibility = "hidden";
                                            buffer.style.position = "absolute";
                                            preview.style.position = "";
                                            preview.style.visibility = "";
                                        },

                                        //
                                        //  This gets called when a key is pressed in the textarea.
                                        //  We check if there is already a pending update and clear it if so.
                                        //  Then set up an update to occur after a small delay (so if more keys
                                        //    are pressed, the update won't occur until after there has been
                                        //    a pause in the typing).
                                        //  The callback function is set up below, after the Preview object is set up.
                                        //
                                        Update: function () {
                                            if (this.timeout) {
                                                clearTimeout(this.timeout)
                                            }
                                            this.timeout = setTimeout(this.callback, this.delay);
                                        },

                                        //
                                        //  Creates the preview and runs MathJax on it.
                                        //  If MathJax is already trying to render the code, return
                                        //  If the text hasn't changed, return
                                        //  Otherwise, indicate that MathJax is running, and start the
                                        //    typesetting.  After it is done, call PreviewDone.
                                        //
                                        CreatePreview: function () {
                                            Preview.timeout = null;
                                            if (this.mjPending) return;
                                            // var text = document.getElementById("MathInput").value;
                                            var dialog = CKEDITOR.dialog.getCurrent();
                                            var text = dialog.getContentElement('info', 'MathInput').getInputElement().getValue();
                                            if (text === this.oldtext) return;
                                            if (this.mjRunning) {
                                                this.mjPending = true;
                                                MathJax.Hub.Queue(["CreatePreview", this]);
                                            } else {
                                                this.buffer.innerHTML = this.oldtext = text;
                                                this.mjRunning = true;
                                                MathJax.Hub.Queue(
                                                    ["Typeset", MathJax.Hub, this.buffer],
                                                    ["PreviewDone", this]
                                                );
                                            }
                                        },

                                        //
                                        //  Indicate that MathJax is no longer running,
                                        //  and swap the buffers to show the results.
                                        //
                                        PreviewDone: function () {
                                            this.mjRunning = this.mjPending = false;
                                            this.SwapBuffers();
                                        }
                                    };
//
//          Cache a callback to the CreatePreview action
//
                                    Preview.callback = MathJax.Callback(["CreatePreview", Preview]);
                                    Preview.callback.autoReset = true;  // make sure it can run more than once
                                    Preview.Init();
                                    Preview.Update();

                                });
                            }
                        },


                        setup: function (widget) {
                            // Remove \( and \).
                            this.setValue(widget.data.math);
                        }
                        ,

                        commit: function (widget) {
                            //Setting Widget Data
                            widget.setData('math', this.getValue());
                        }
                    },
                    {
                        id: 'about',
                        type: 'html',
                        html: '<div style="width:100%;text-align:left;margin:-8px 0 10px">' +

                        '</div>'
                    },
                    {
                        id: 'documentation',
                        type: 'html',
                        html: '<div style="width:100%;text-align:right;margin:-8px 0 10px">' +
                        '<a class="cke_mathjax_doc" href="' + about_uri + '" target="_blank" style="cursor:pointer;color:#00B2CE;text-decoration:underline">' +
                        about_dev +
                        '</a>'+'&nbsp;&nbsp;' +
                        '<a class="cke_mathjax_doc" href="' + mathjaxuri + '" target="_blank" style="cursor:pointer;color:#00B2CE;text-decoration:underline">' +
                        mathjaxdoc +
                        '</a>' +
                        '</div>'
                    }
                    ,
                    ( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) && {
                        id: 'preview',
                        type: 'html',
                        html: '<div style="width:100%;text-align:center;">' +
                        // '<iframe style="border:0;width:0;height:0;font-size:20px" scrolling="no" frameborder="0" allowTransparency="true" src="' + CKEDITOR.plugins.mathjax2.fixSrc + '"></iframe>' +
                        '<div id="MathPreview" style="border:1px dotted #ccc; padding: 3px; width:50%; margin-top:5px"></div>' +
                        '<div id="MathBuffer" style="border:1px dotted #ccc; padding: 3px; width:50%; margin-top:5px;visibility:hidden; position:absolute; top:0; left: 0"></div>' +
                        '<script src="' + CKEDITOR.getUrl(editor.config.mathJaxLib) + '"></script></head>' +
                        '<script type="text/x-mathjax-config">' +
                        'MathJax.Hub.Config({' +
                        'showProcessingMessages: false,' +
                        'tex2jax: { inlineMath: [[\'$\',\'$\'],[\'\\\\(\',\'\\\\)\']]}' +
                        '});' +
                        '</script>' +
                        '</div>',

                        onLoad: function () {
                            var iFrame = CKEDITOR.document.getById(this.domId).getChild(0);
                            console.log(iFrame);

                        },

                        setup: function( widget ) {
                        	this.setValue( widget.data.math );
                        },
                        commit: function( widget ) {
                            widget.setData('math', this.getValue(preview));
                        }



                    }
                ]
            }
        ]
    };
});


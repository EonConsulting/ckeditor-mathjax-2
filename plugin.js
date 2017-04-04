/**
 * @license Copyright (c) 2017 Peace Ngara
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The [Mathematical Formulas](http://docs.mathjax.org) plugin that allows you to create and modify mathematical equations written in TEX, MathML, LaTex, Ascii Math directly in CKEditor..
 */

'use strict';

(function () {
    CKEDITOR.plugins.add('mathjax2', {
        lang: 'en,en-gb', // %REMOVE_LINE_CORE%
        requires: 'widget,dialog',
        icons: 'mathjax2',
        hidpi: true, // %REMOVE_LINE_CORE%

        init: function (editor) {
            var cls = editor.config.mathJaxClass || 'math-tex';

            if (!editor.config.mathJaxLib) {
                CKEDITOR.error('mathjax-no-config');
            }

            editor.widgets.add('mathjax2', {
                inline: true,
                dialog: 'mathjax2',
                button: editor.lang.mathjax2.button,
                mask: true,
                allowedContent: 'iframe[!width,!height,!src,!frameborder,!allowfullscreen]; object param[*]' +
                    'div;' +
                    'svg[!width,!height,!viewBox,!role,!focusable,!style]; object param[*];',
                pathName: editor.lang.mathjax2.pathName,

                template: '<span class="' + cls + '" style="display:inline-block" data-cke-survive=1>' +
                '<svg></svg>' +
                '</span>',

                defaults: {
                    math: '\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)'
                },

                parts: {
                    span: 'span'
                },

                data: function () {
                        //this.element.setValue(this.data.math);
                        this.parts.span.setHtml(this.data.math);

                },
                upcast: function( el, data ) {
                    if ( !( el.name == 'span' && el.hasClass( cls ) ) )
                        return;

                    if ( el.children.length > 1 || el.children[ 0 ].type != CKEDITOR.NODE_TEXT )
                        return;

                    data.math = CKEDITOR.tools.htmlDecode( el.children[ 0 ].value );

                    // Add style display:inline-block to have proper height of widget wrapper and mask.
                    var attrs = el.attributes;

                    if ( attrs.style )
                        attrs.style += ';display:inline-block';
                    else
                        attrs.style = 'display:inline-block';

                    // Add attribute to prevent deleting empty span in data processing.
                    attrs[ 'data-cke-survive' ] = 1;

                    el.children[ 0 ].remove();

                    return el;
                },

                init: function (widget) {
                    var data = { math : "" };
                    this.setData('math', CKEDITOR.tools.htmlEncode( this.data.math ));

                },

                downcast: function( el ) {
                    el.children[ 0 ].replaceWith( new CKEDITOR.htmlParser.text( CKEDITOR.tools.htmlEncode( this.data.math ) ) );

                    // Remove style display:inline-block.
                    var attrs = el.attributes;
                    attrs.style = attrs.style.replace( /display:\s?inline-block;?\s?/, '' );
                    if ( attrs.style === '' )
                        delete attrs.style;

                    return el;
                }

            });

            // Add dialog.
            CKEDITOR.dialog.add('mathjax2', this.path + 'dialogs/mathjax2.js');

            // Add MathJax script to page preview.
            editor.on('contentPreview', function (evt) {
                evt.data.dataValue = evt.data.dataValue.replace(
                    /<\/head>/,
                    '<script src="' + CKEDITOR.getUrl(editor.config.mathJaxLib) + '"><\/script><\/head>'
                );
            });

            // editor.on('paste', function (evt) {
            //     // Firefox does remove iFrame elements from pasted content so this event do the same on other browsers.
            //     // Also iFrame in paste content is reason of "Unspecified error" in IE9 (#10857).
            //     var regex = new RegExp('<span[^>]*?' + cls + '.*?<\/span>', 'ig');
            //     evt.data.dataValue = evt.data.dataValue.replace(regex, function (match) {
            //         return match.replace(/(<iframe.*?\/iframe>)/i, '');
            //     });
            // });
        }
    });

    /**
     * @private
     * @singleton
     * @class CKEDITOR.plugins.mathjax
     */
    CKEDITOR.plugins.mathjax2 = {};

    /**
     * A variable to fix problems with `iframe`. This variable is global
     * because it is used in both the widget and the dialog window.
     *
     * @private
     * @property {String} fixSrc
     */

    CKEDITOR.plugins.mathjax2.loadingIcon = CKEDITOR.plugins.get('mathjax2').path + 'images/loader.gif';

    /**
     * FrameWrapper is responsible for communication between the MathJax library
     * and the `iframe` element that is used for rendering mathematical formulas
     * inside the editor.
     * It lets you create visual mathematics by using the
     * {@link CKEDITOR.plugins.mathjax.frameWrapper#setValue setValue} method.
     *
     * @private
     * @class CKEDITOR.plugins.mathjax.frameWrapper
     * @constructor Creates a class instance.
     * @param {CKEDITOR.dom.element} iFrame The `iframe` element to be wrapped.
     * @param {CKEDITOR.editor} editor The editor instance.
     */
})
()

/**
 * Sets the path to the MathJax library. It can be both a local resource and a location different than the default CDN.
 *
 * Please note that this must be a full or absolute path.
 *
 * Read more in the [documentation](#!/guide/dev_mathjax)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/mathjax.html).
 *
 *        config.mathJaxLib = '//cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML';
 *
 * **Note:** Since CKEditor 4.5 this option does not have a default value, so it must
 * be set in order to enable the MathJax plugin.
 *
 * @since 4.3
 * @cfg {String} mathJaxLib
 * @member CKEDITOR.config
 */

/**
 * Sets the default class for `span` elements that will be
 * converted into [Mathematical Formulas](http://ckeditor.com/addon/mathjax)
 * widgets.
 *
 * If you set it to the following:
 *
 *        config.mathJaxClass = 'my-math';
 *
 * The code below will be recognized as a Mathematical Formulas widget.
 *
 *        <span class="my-math">\( \sqrt{4} = 2 \)</span>
 *
 * Read more in the [documentation](#!/guide/dev_mathjax)
 * and see the [SDK sample](http://sdk.ckeditor.com/samples/mathjax.html).
 *
 * @cfg {String} [mathJaxClass='math-tex']
 * @member CKEDITOR.config
 */

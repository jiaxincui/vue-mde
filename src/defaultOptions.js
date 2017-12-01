
export default {
    toolbars: [
        'header',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'code',
        'link',
        'image',
        'table',
        '|',
        'unorderedList',
        'orderedList',
        'quote',
        'horizontalRule',
        '|',
        'preview',
        'fullScreen',
        'help'
    ],

    codeMirror: {
        lineNumbers: false,
        mode: "markdown",
        theme: '3024-day',
        lineWrapping: true,
        autofocus: true,
    },

    markdownIt: {
        loadPlugins: function(markdownIt) {
            // markdownIt.use(MarkdownItIns)
            //     .use(MarkdownItEmoji)
            //     .use(MarkdownItMark)
            //     .use(MarkdownItAbbr)
            //     .use(MarkdownItDeflist)
            //     .use(MarkdownItFootnote)
        }
    },

    locales: {
        insertLink: 'Insert link',
        insertImage: 'Insert image',
        linkText: 'Link text',
        linkUrl: 'Link url',
        cancel: 'Cancel',
        apply: 'Apply',
        addFile: 'Add file',
        uploadAll: 'Upload all',
        removeAll: 'Remove all',

    },

    dropzone: {
        headers: {},
        url: '/',
        paramName: 'upfile',
        uploadMultiple: false,
        autoQueue: false,
        parallelUploads: 5,
        maxFilesize: 2000,
        thumbnailWidth: 90,
        thumbnailHeight: 90,
        acceptedFiles: 'image/png,image/jpeg,image/gif,image/bmp,image/svg+xml',
        dictInvalidFileType: 'Not allowed the mime type',
        dictResponseError: 'Server Error {{statusCode}}',
        previewTemplate: `
            <div class="dz-item">
                <img class="img-thumbnail" data-dz-thumbnail>
                <p class="dz-progress" data-dz-uploadprogress></p>
                <div class="dz-item-cover">
                    <div class="dz-error hidden"></div>
                    <div class="dz-item-btn">
                        <button class="btn btn-default btn-sm dz-item-start">
                           <span class="fa fa-upload"></span>
                        </button>
                        <button class="btn btn-default btn-sm dz-item-cancel">
                            <span class="fa fa-remove"></span>
                        </button>
                    </div>
                </div>
            </div>
        `,
    }
}
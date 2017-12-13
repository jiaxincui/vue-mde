
export default {
    imagesTransformer: function (images) {
        let res = [];
        let imagesData = images.data;
        for (let i = 0, l = imagesData.length; i < l; i++) {
            res[i] = {
                id: imagesData[i].id,
                title: imagesData[i].display_name,
                uri: `/${imagesData[i].id}`,
                thumbnail: `/${imagesData[i].id}/thumbnail`
            }
        }
        return {data: res, meta: images.meta}
    },
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
        autofocus: true
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
        removeAll: 'Remove all'

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
                <div class="item-progress" data-dz-uploadprogress>
                    <span class="fa fa-3x"></span>
                </div>
                <div class="item-btn">
                    <button class="btn btn-default btn-sm item-start"><span class="fa fa-upload"></span></button>
                    <button class="btn btn-default btn-sm item-cancel"><span class="fa fa-remove"></span></button>
                </div>
            </div>
        `
    }
}
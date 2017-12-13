<template>
    <div class="mde-container">
        <div class="btn-toolbar mde-toolbar" role="toolbar" aria-label="toolbar">
            <div class="btn-group" role="group" aria-label="btn-group" v-for="group in toolbars">
                <button type="button"
                        class="btn btn-default btn-sm"
                        v-for="toolbar in group"
                        :title="toolbar.title"
                        @click="toolbarAction(toolbar.name)">
                    <span :class="toolbar.classes"></span>
                </button>
            </div>
        </div>
        <div class="mde-write" :class="{hidden: ! writeStatus}" ref="mdeWrite">
            <textarea v-model="markdown" ref="textArea"></textarea>
        </div>
        <div class="mde-preview" :class="{hidden: writeStatus}" v-html="html" ref="mdePreview"></div>
        <p class="text-right" :class="{hidden: ! writeStatus}"><small>Lines: {{totalLine}}</small>&nbsp;&nbsp;<small> words: {{totalChar}}</small></p>
        <insert-link ref="insertLink" :link-text="linkText" :link-url="linkUrl" :locales="activeOptions.locales" @insert-link="insertLink"></insert-link>
        <div class="modal fade" tabindex="-1" role="dialog" ref="dropzoneModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{activeOptions.locales.insertImage}}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div ref="dropzone" class="dz-container">
                                    <div ref="dropzoneContainer"></div>
                                </div>
                                <div class="dz-btn">
                                    <button type="button" class="btn btn-primary btn-sm" ref="addFile">{{activeOptions.locales.addFile}}</button>
                                    <button type="button" class="btn btn-success btn-sm" ref="uploadAll">{{activeOptions.locales.uploadAll}}</button>
                                    <button type="button" class="btn btn-danger btn-sm" ref="removeAll">{{activeOptions.locales.removeAll}}</button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3" v-for="item in imageData.data"  @click="toggleImageChecked(item)">
                                <div class="dz-img-item">
                                    <img class="img-thumbnail" :src="activeOptions.dropzone.url + item.thumbnail" :alt="item.title">
                                    <div class="img-checked" :class="{hidden: checkedImages.indexOf(item) < 0}">
                                        <span class="fa fa-check fa-3x"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12" >
                                <ul class="pagination">
                                    <li>
                                        <strong>{{imageData.meta.from}}</strong>&nbsp;-&nbsp;<strong>{{imageData.meta.to}}</strong>&nbsp;
                                        /&nbsp;<strong>{{imageData.meta.total}}</strong>
                                    </li>
                                </ul>
                                <pagination @change-page="fetchImages" :pagination="imageData.meta" class="pull-right"></pagination>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{activeOptions.locales.cancel}}</button>
                        <button type="button" class="btn btn-primary" @click="insertImage">{{activeOptions.locales.apply}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import CodeMirror from 'codemirror'
    import Markdown from 'codemirror/mode/markdown/markdown'

    import MarkdownIt from 'markdown-it'

    import DefaultOptions from '../defaultOptions'

    import Toolbars from '../toolbars'

    import ToolbarOperations from '../toolbarOperations'

    import 'codemirror/lib/codemirror.css'

    import 'codemirror/theme/3024-day.css'

    import '../vueMde.css'

    import thumbnail from '../assets/thumbnail.svg'

    import InsertLink from './Link.vue'

    import Pagination from './Pagination.vue'

    import axios from 'axios'

    import Dropzone from 'dropzone'
    Dropzone.autoDiscover = false;

    export default {
        name: 'vue-mde',

        model: {
            prop: 'content',
            event: 'change'
        },

        props: {
            content: {
                type: Object,
                default() {
                    return {
                        markdown: '',
                        html: ''
                    }
                }
            },
            options: {
                type: Object,
                default() {
                    return {}
                }
            }
        },

        components: {
            'insert-link': InsertLink,
            'pagination': Pagination
        },

        data() {
            return {
                mt: Object,
                cm: Object,
                http: axios,
                markdown: '',
                html: '',
                activeOptions: {
                    dropzone: {
                        headers: {}
                    },
                    codeMirror: {}
                },
                toolbars: [[]],
                writeStatus: true,
                linkText: '',
                linkUrl: 'http://',
                totalLine: 1,
                totalChar: 0,
                imageData: {meta:{}},
                checkedImages: [],
            }
        },

        created() {
            this.activeOptions = Object.assign({}, DefaultOptions, this.options);
            this.activeOptions.codeMirror = Object.assign({}, DefaultOptions.codeMirror, this.options.codeMirror);
            this.activeOptions.markdownIt = Object.assign({}, DefaultOptions.markdownIt, this.options.markdown);
            this.activeOptions.locales = Object.assign({}, DefaultOptions.locales, this.options.locales);
            this.activeOptions.dropzone = Object.assign({}, DefaultOptions.dropzone, this.options.dropzone);
            this.activeOptions.codeMirror.value = this.markdown
            let build = [[]];
            if (this.options.toolbars && this.options.toolbars.length) {
                let buildIdx = 0;
                if (Array.isArray(this.options.toolbars)) {
                    let toolbars = this.options.toolbars;
                    for (let i = 0, len = toolbars.length; i < len; i++) {
                        if ((typeof toolbars[i]) === 'string' && toolbars[i].constructor === String) {
                            if (toolbars[i] === '|') {
                                buildIdx ++;
                                build[buildIdx] = []
                            }
                            if (Toolbars[toolbars[i]]) {
                                build[buildIdx].push(Toolbars[toolbars[i]])
                            }
                        } else if ((typeof toolbars[i]) === 'object') {
                            if (toolbars[i].name) {
                                if (Toolbars[toolbars[i].name]) {
                                    build[buildIdx].push(Object.assign(Toolbars[toolbars[i].name], toolbars[i]))
                                } else {
                                    build[buildIdx].push(toolbars[i])
                                }
                            }
                        }
                    }
                }
            } else {
                let buildIdx = 0;
                let toolbars = DefaultOptions.toolbars;
                for (let i = 0, len = toolbars.length; i < len; i++) {
                    if (toolbars[i] === '|') {
                        buildIdx ++;
                        build[buildIdx] = []
                    } else {
                        build[buildIdx].push(Toolbars[toolbars[i]])
                    }
                }
            }
            this.toolbars = build;

            this.markdown = this.content.markdown;
        },

        mounted() {
            this.mt = new MarkdownIt();
            this.activeOptions.markdownIt.loadPlugins(this.mt);

            this.$nextTick(function () {
                this.cm = CodeMirror.fromTextArea(this.$refs.textArea, this.activeOptions.codeMirror);

                this.dz = new Dropzone(this.$refs.dropzone, Object.assign(this.activeOptions.dropzone, {
                    previewsContainer: this.$refs.dropzoneContainer,
                    clickable: [this.$refs.dropzone, this.$refs.addFile],
                }));

                this.cm.on('change', () => {
                    this.markdown = this.cm.getValue();
                    this.html = this.mt.render(this.markdown);
                    this.totalLine = this.cm.doc.lineCount();
                    let blank = this.markdown.match(/\s/g);
                    this.totalChar = this.markdown.length - (!blank ? 0 : blank.length);
                    this.$emit('change', {markdown: this.markdown, html: this.html})
                });

                this.cm.on('drop', (cm, event) => {
                    event.preventDefault();
                    $(this.$refs.dropzoneModal).modal();
                    let drop = document.createEvent("MouseEvents");
                    drop.initEvent('drop',false,false);
                    drop.dataTransfer = event.dataTransfer;
                    this.$refs.dropzone.dispatchEvent(drop)
                });

                this.cm.on('keyHandled', (cm, name) => {
                    if (name === 'Enter') {
                        let line = cm.getCursor().line;
                        let unorderedListMarkup = /^(\s*[\*\+\-]){1}\s+\S+/g.exec(cm.getLine(line - 1));
                        if (unorderedListMarkup !== null){
                            cm.replaceRange(unorderedListMarkup[1] + ' ', {line: line, ch: 0});
                            return
                        }
                        let orderedListMarkup = /^(\s*)([0-9]+)\.{1}\s+\S+/g.exec(cm.getLine(line - 1));
                        if (orderedListMarkup !== null) {
                            let listNumber = Number(orderedListMarkup[2]) + 1;
                            cm.replaceRange(orderedListMarkup[1] + listNumber + '. ', {line: line, ch: 0});
                            return
                        }
                    }
                });

                this.dz.on("addedfile", (file) => {
                    if (! file.type.match('/image.*/')) {
                        this.dz.emit("thumbnail", file, thumbnail);
                    }
                    file.previewElement.querySelector(".item-cancel").onclick = () => { this.dz.removeFile(file)}
                    file.previewElement.querySelector(".item-start").onclick = () => { this.dz.enqueueFile(file) }
                });

                this.dz.on("success", (file) => {
                    file.previewElement.querySelector('.item-progress').style.width = '100%';
                    file.previewElement.querySelector('.item-start').style.display = 'none';
                    let fileDom = file.previewElement.querySelector('.item-progress span');
                    fileDom.classList.add('fa-check-circle');
                    fileDom.style.opacity = 100;
                    let t;
                    clearTimeout(t);
                    t = setTimeout(() => {
                        this.dz.removeFile(file);
                    }, 3000);
                    this.fetchImages();
                });

                this.dz.on("error", (file, message, xhr) => {
                    file.previewElement.querySelector('.item-progress').style.width = '100%';
                    file.previewElement.querySelector('.item-start').style.display = 'none';
                    file.previewElement.querySelector('.img-thumbnail').style.borderColor = '#d9534f';
                    let fileDom = file.previewElement.querySelector('.item-progress span');
                    fileDom.classList.add('fa-exclamation-circle');
                    fileDom.style.opacity = 100;
                });

                this.$refs.uploadAll.onclick = () => {
                    this.dz.enqueueFiles(this.dz.getFilesWithStatus(Dropzone.ADDED));
                };

                this.$refs.removeAll.onclick = () => {
                    this.dz.removeAllFiles(true);
                };
            })
        },

        methods: {
            insertLink(formData) {
                this.cm.replaceSelection(`[${formData.linkText ? formData.linkText : formData.linkUrl}](${formData.linkUrl})`, 'around')
                this.$nextTick(function() {
                    $(this.$refs.insertLink.$el).modal('hide')
                });
            },

            insertImage() {
                let imagesMarkup = '';
                for (let i = 0, len = this.checkedImages.length; i < len; i++) {
                    imagesMarkup += `![${this.checkedImages[i].title}](${this.activeOptions.dropzone.url}${this.checkedImages[i].uri}) `
                }
                this.cm.replaceSelection(imagesMarkup, 'around');
                this.$nextTick(function() {
                    $(this.$refs.dropzoneModal).modal('hide')
                });
            },

            fetchImages(page) {
                if (! page) {
                    page = 1
                }
                this.http.get(this.activeOptions.dropzone.url + '?page=' + page, {
                    headers: this.activeOptions.dropzone.headers,
                }).then(res => {
                    this.imageData = this.activeOptions.imagesTransformer(res.data);
                    this.checkedImages = []
                })
            },

            toggleImageChecked(item) {
                let index = this.checkedImages.indexOf(item);
                if (index >= 0) {
                    this.checkedImages.splice(index, 1)
                } else {
                    this.checkedImages.push(item)
                }
            },

            toggleTab(name) {
                this.tabStatus = name
            },

            toolbarAction(name) {
                if (! this.writeStatus && name !== 'preview') return

                switch (name) {
                    case 'preview':
                        this.markdown = this.cm.getValue();
                        this.html = this.mt.render(this.markdown);
                        this.writeStatus = ! this.writeStatus;
                        break;
                    case 'header':
                        ToolbarOperations.header(this.cm);
                        break;
                    case 'bold':
                        ToolbarOperations.bold(this.cm);
                        break;
                    case 'italic':
                        ToolbarOperations.italic(this.cm);
                        break;
                    case 'strikeThrough':
                        ToolbarOperations.strikeThrough(this.cm);
                        break;
                    case 'underline':
                        ToolbarOperations.underline(this.cm);
                        break;
                    case 'code':
                        ToolbarOperations.code(this.cm);
                        break;
                    case 'table':
                        ToolbarOperations.table(this.cm);
                        break;
                    case 'unorderedList':
                        ToolbarOperations.unorderedList(this.cm);
                        break;
                    case 'orderedList':
                        ToolbarOperations.orderedList(this.cm);
                        break;
                    case 'quote':
                        ToolbarOperations.quote(this.cm);
                        break;
                    case 'horizontalRule':
                        ToolbarOperations.horizontalRule(this.cm);
                        break;
                    case 'link':
                        let patt = /^\[+?(.*)\]+?\(+?(.*)\)+?$/g.exec(this.cm.getSelection());
                        if (patt !== null) {
                            this.linkText = patt[1];
                            this.linkUrl = patt[2]
                        } else {
                            this.linkText = this.cm.getSelection();
                            this.linkUrl = 'http://'
                        }
                        this.$nextTick(function() {
                            $(this.$refs.insertLink.$el).modal()
                        });
                        break;
                    case 'image':
                        this.$nextTick(function() {
                            this.fetchImages();
                            $(this.$refs.dropzoneModal).modal()
                        });
                        break;
                    case 'fullScreen':
                        this.$nextTick(function() {
                            this.$el.classList.toggle('cm-full-screen')
                        });
                        break;
                    default:
                        this.$emit('user-toolbar', name, this.cm);
                }
            },
        }
    }
</script>


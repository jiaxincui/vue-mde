export default {
    header(cm) {
        let line = cm.getCursor('start').line;
        if (cm.getRange({line: line, ch: 0}, {line: line, ch: 6}) === '######') return
        if (cm.getRange({line: line, ch: 0}, {line: line, ch: 1}) === '#') {
            cm.replaceRange('#', {line: line, ch: 0})
        } else {
            cm.replaceRange('# ', {line: line, ch: 0})
        }
        cm.execCommand('goLineDown')
        cm.focus()
    },
    quote(cm) {
        let line = cm.getCursor('start').line;
        let content = cm.getLine(line);
        if (/^\s*\>+/g.test(content)) return
        cm.replaceRange('> ', {line: line, ch: 0})
        cm.replaceRange('\n', {line: line + 1, ch: 0})
        cm.execCommand('goLineDown')
        cm.focus()
    },
    bold(cm) {
        this.insertInline(cm, '**')
    },
    italic(cm) {
        this.insertInline(cm, '*')
    },
    strikeThrough(cm) {
        this.insertInline(cm, '~~')
    },
    underline(cm) {
        this.insertInline(cm, '++')
    },
    code(cm) {
        let start = cm.getCursor('start');
        let end = cm.getCursor('end');
        let selection = cm.getSelection();
        if (start.line === end.line) {
            cm.replaceSelection('`' + selection + '`');
            if (! /\S+?/g.test(selection)) {
                cm.setCursor(start.line, start.ch + 1)
            }
        } else {
            cm.replaceSelection('``` \n' + selection + '\n ```', 'around');
            if (! /\S+?/g.test(selection)) {
                cm.setCursor(start.line + 1, start.ch + 3)
            }
        }
        cm.focus()
    },
    table(cm) {
        let end = cm.getCursor('end');
        let range = '\n |column|column|column| \n |------|------|------| \n |text1|text2|text3| \n'
        cm.replaceRange(range, {line: end.line, ch: end.ch})
        cm.setCursor(end.line + 4, 0)
        cm.focus()
    },
    unorderedList(cm) {
        let line = cm.getCursor('end').line;
        if (cm.getRange({line: line, ch: 0}, {line: line, ch: 1}) === '*') return
        cm.replaceRange('* ', {line: line, ch: 0})
        cm.execCommand('goLineEnd')
        cm.focus()
    },
    orderedList(cm) {
        let line = cm.getCursor('end').line;
        if (/(^\s*)([0-9]+)\.{1}\s+\S+/g.test(cm.getLine(line))) return
        cm.replaceRange('1. ', {line: line, ch: 0})
        cm.execCommand('goLineEnd')
        cm.focus()
    },
    horizontalRule(cm) {
        let end = cm.getCursor('end');
        cm.replaceRange('\n *** \n', end)
        cm.focus()
    },
    insertInline(cm, markup) {
        let start = cm.getCursor('start');
        let end = cm.getCursor('end');
        if (start.line < end.line) {
            for (let i = start.line; i <= end.line; i++) {
                if (! /\S/g.test(cm.getLine(i))) {
                    return false
                }
            }
        }
        let selection = cm.getSelection();
        cm.replaceSelection(markup + selection.replace(/(^\s*)|(\s*$)/g, '') + markup, 'around')
        if (! /\S+?/g.test(selection)) {
            cm.setCursor(start.line, start.ch + markup.length)
        }
        cm.focus()
    }
}
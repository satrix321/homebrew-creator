import marked from 'marked';
import Vue from 'vue';
import PageParagraph from '@/components/documentComponents/PageParagraph';
import PageThematicBreak from '@/components/documentComponents/PageThematicBreak';
import PageHeading from '@/components/documentComponents/PageHeading';
import PageColumnBreak from '@/components/documentComponents/PageColumnBreak';
import PageNote from '@/components/documentComponents/PageNote';
import PageTable from '@/components/documentComponents/PageTable';
import PageHtml from '@/components/documentComponents/PageHtml';
import PageList from '@/components/documentComponents/PageList';

let PageParagraphClass = Vue.extend(PageParagraph);
let PageThematicBreakClass = Vue.extend(PageThematicBreak);
let PageHeadingClass = Vue.extend(PageHeading);
let PageColumnBreakClass = Vue.extend(PageColumnBreak);
let PageNoteClass = Vue.extend(PageNote);
let PageTableClass = Vue.extend(PageTable);
let PageHtmlClass = Vue.extend(PageHtml);
let PageListClass = Vue.extend(PageList);

function countOccurrences (array, item) {
  let occurrences = 0;
  for (let value of array) {
    if (value === item) {
      occurrences++;
    }
  }
  return occurrences;
}

let parse = function (markdown, options) {
  let createdComponents = [];
  let outputComponents = [];

  let tokenStack = [];
  let listTypes = [];
  let componentStack = [];
  let tokens = marked.lexer(markdown);
  console.log(tokens);

  componentStack.last = function () {
    if (this.length > 0) {
      return this[this.length - 1];
    }
    return undefined;
  };

  for (let token of tokens) {
    switch (token.type) {
      case 'space': {
        continue;
      }
      case 'hr': {
        let thematicBreak = new PageThematicBreakClass({
          propsData: { 
            pageTheme: options.theme
          }
        });
        createdComponents.push(thematicBreak);
        if (tokenStack.length === 0) {
          outputComponents.push(thematicBreak);
        } else {
          componentStack.last().push(thematicBreak);
        }
        break;
      }
      case 'heading': {
        let heading = new PageHeadingClass({
          propsData: { 
            depth: token.depth, 
            pageTheme: options.theme,
            isTitlePage: options.isTitlePage
          }
        });
        heading.$slots.default = [token.text];
        createdComponents.push(heading);
        if (tokenStack.length === 0) {
          outputComponents.push(heading);
        } else {
          componentStack.last().push(heading);
        }
        break;
      }
      case 'code': {
        if (tokenStack.length === 0) {
          let columnBreak = new PageColumnBreakClass({
            propsData: {
              pageWorkAreaHeight: options.pageWorkAreaHeight,
              precedingComponents: Array.from(outputComponents),
            }
          });
          createdComponents.push(columnBreak);
          outputComponents.push(columnBreak);
        } else {
          let columnBreak = new PageColumnBreakClass();
          createdComponents.push(columnBreak);
          componentStack.last().push(columnBreak);
        }
        break;
      }
      case 'table': {
        let table = new PageTableClass({
          propsData: {
            headers: token.header,
            align: token.align,
            cells: token.cells,
            pageTheme: options.theme
          }
        });
        createdComponents.push(table);
        if (tokenStack.length === 0) {
          outputComponents.push(table);
        } else {
          componentStack.last().push(table);
        }
        break;
      }
      case 'blockquote_start': {
        if (tokenStack.length === 0 || tokenStack[tokenStack.length - 1] !== 'blockquote_start') {
          componentStack.push([]);
        }
        tokenStack.push('blockquote_start');
        break;
      }
      case 'blockquote_end': {
        let startOccurrences = countOccurrences(tokenStack, 'blockquote_start');
        if (startOccurrences > 1) {
          let endOccurrences = countOccurrences(tokenStack, 'blockquote_end') + 1;
          if (startOccurrences > endOccurrences) {
            tokenStack.push('blockquote_end');
            break;
          } else if (startOccurrences < endOccurrences) {
            console.error('blockquote tags error');
          }
        }

        let tokenPopCount = 0;
        while (tokenPopCount !== startOccurrences) {
          if (tokenStack[tokenStack.length - 1] === 'blockquote_start') {
            tokenPopCount++;
          }
          tokenStack.pop();
        }

        let noteType;
        switch (startOccurrences) {
          case 1: {
            noteType = 'note--primary';
            break;
          }
          case 2: {
            noteType = 'note--secondary';
            break;
          }
          case 3: {
            noteType = 'note--tertiary';
            break;
          }
        }

        let note = new PageNoteClass({
          propsData: { 
            noteType: noteType,
            components: componentStack.pop(),
            pageTheme: options.theme,
            texturesEnabled: options.noteTexturesEnabled,
            columnCount: options.columnCount
          }
        });

        createdComponents.push(note);
        if (tokenStack.length === 0) {
          outputComponents.push(note);
        } else {
          componentStack.last().push(note);
        }

        break;
      }
      case 'list_start': {
        listTypes.push(token.ordered ? 'ordered' : 'unordered');
        tokenStack.push('list_start');
        componentStack.push([]);
        break;
      }
      case 'list_item_start': {
        tokenStack.push('list_item_start');
        break;
      }
      case 'list_item_end': {
        let tokenPopCount = 0;
        while (tokenPopCount !== 1) {
          if (tokenStack[tokenStack.length - 1] === 'list_item_start') {
            tokenPopCount++;
          }
          tokenStack.pop();
        }
        break;
      }
      case 'list_end': {
        let list = new PageListClass({
          propsData: {
            listType: listTypes.pop(),
            listComponents: componentStack.pop(),
            pageTheme: options.theme
          }
        });

        let tokenPopCount = 0;
        while (tokenPopCount !== 1) {
          if (tokenStack[tokenStack.length - 1] === 'list_start') {
            tokenPopCount++;
          }
          tokenStack.pop();
        }

        createdComponents.push(list);
        if (tokenStack.length === 0) {
          outputComponents.push(list);
        } else {
          componentStack.last().push(list);
        }
        break;
      }
      case 'html': {
        let htmlBlock = new PageHtmlClass({
          propsData: {
            html: token.text,
            pageTheme: options.theme,
            noteTexturesEnabled: options.noteTexturesEnabled,
            columnCount: options.columnCount
          }
        });
        createdComponents.push(htmlBlock);
        if (tokenStack.length === 0) {
          outputComponents.push(htmlBlock);
        } else {
          componentStack.last().push(htmlBlock);
        }
        break;
      }
      case 'text' :
      case 'paragraph': {
        let paragraph = new PageParagraphClass({
          propsData: { 
            text: token.text,
            pageTheme: options.theme
          }
        });
        createdComponents.push(paragraph);
        if (tokenStack.length === 0) {
          outputComponents.push(paragraph);
        } else {
          componentStack.last().push(paragraph);
        }
        break;
      }
    }
  }

  return {
    outputComponents,
    createdComponents
  };
};
export default parse;
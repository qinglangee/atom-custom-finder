/** @babel */
// 'use babel';
import SelectListView from 'atom-select-list'
import {humanizeKeystroke} from 'underscore-plus'
import fuzzaldrin from 'fuzzaldrin'
import fuzzaldrinPlus from 'fuzzaldrin-plus'
import PathUtil from './path-util'

export default class CustomFinderView {

  constructor(serializedState) {
    this.pathUtil = new PathUtil();
    this.items = []
    this.selectListView = new SelectListView({
      items: this.items,
      emptyMessage: 'No matches found',
      filterKeyForItem: (item) => item.fullPath,
      elementForItem: ({name, fullPath}) => {
        const li = document.createElement('li')
        li.classList.add('event')
        li.dataset.eventName = name

        const span = document.createElement('span')
        span.title = name
        const query = this.selectListView.getQuery()
        const matches = this.useAlternateScoring ? fuzzaldrinPlus.match(fullPath, query) : fuzzaldrin.match(fullPath, query)
        let matchedChars = []
        let lastIndex = 0
        for (const matchIndex of matches) {
          const unmatched = fullPath.substring(lastIndex, matchIndex)
          if (unmatched) {
            if (matchedChars.length > 0) {
              const matchSpan = document.createElement('span')
              matchSpan.classList.add('character-match')
              matchSpan.textContent = matchedChars.join('')
              span.appendChild(matchSpan)
              matchedChars = []
            }
        
            span.appendChild(document.createTextNode(unmatched))
          }
        
          matchedChars.push(fullPath[matchIndex])
          lastIndex = matchIndex + 1
        }
        
        if (matchedChars.length > 0) {
          const matchSpan = document.createElement('span')
          matchSpan.classList.add('character-match')
          matchSpan.textContent = matchedChars.join('')
          span.appendChild(matchSpan)
        }
        
        const unmatched = fullPath.substring(lastIndex)
        if (unmatched) {
          span.appendChild(document.createTextNode(unmatched))
        }

        li.appendChild(span)
        return li
      },
      didConfirmSelection: (item) => {
        this.hide()
        this.openPath(item.fullPath);
      },
      didCancelSelection: () => {
        this.hide()
      }
    })

    this.selectListView.element.classList.add('command-palette')
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  async destroy() {
    await this.selectListView.destroy()
  }

  toggle() {
    if (this.panel && this.panel.isVisible()) {
      this.hide()
      return Promise.resolve()
    } else {
      return this.show()
    }
  }

  async show(){
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this.selectListView})
      this.items=this.pathUtil.loadAllPath(["/home/zhch/nutstore/wordpress","/home/zhch/nutstore/notes","/home/zhch/nutstore/code"])
      await this.selectListView.update({items: this.items})
    }


    this.selectListView.reset()



    this.previouslyFocusedElement = document.activeElement
    this.panel.show()
    this.selectListView.focus()

  }

  hide(){
    this.panel.hide()
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  
  async openPath (filePath, lineNumber, openOptions) {
    if (filePath) {
      await atom.workspace.open(filePath, openOptions)
      this.moveToLine(lineNumber)
    }
  }

  moveToLine (lineNumber = -1) {
    if (lineNumber < 0) {
      return
    }

    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      const position = new Point(lineNumber, 0)
      editor.scrollToBufferPosition(position, {center: true})
      editor.setCursorBufferPosition(position)
      editor.moveToFirstCharacterOfLine()
    }
  }

}

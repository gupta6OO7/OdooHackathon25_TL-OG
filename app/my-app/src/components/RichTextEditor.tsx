import React, { useRef, useCallback } from 'react';
import './RichTextEditor.css';

interface RichTextEditorProps {
  placeholder?: string;
  value?: string;
  onChange?: (content: string) => void;
  className?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  placeholder = 'Start typing...',
  value = '',
  onChange,
  className = '',
  disabled = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };


  const insertList = (ordered: boolean) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    handleCommand(command);
  };

  const insertCode = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      handleCommand('formatBlock', 'pre');
    } else {
      // Insert inline code
      const code = document.createElement('code');
      code.style.backgroundColor = '#f1f1f1';
      code.style.padding = '2px 4px';
      code.style.borderRadius = '3px';
      code.textContent = 'code';
      const range = selection?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        range.insertNode(code);
        range.selectNodeContents(code);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    handleInput();
  };

  // Insert image by URL
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      handleCommand('insertImage', url);
    }
  };

  React.useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="rte-toolbar">
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand('italic')}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand('underline')}
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="rte-divider" />
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insertList(false)}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insertList(true)}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="rte-divider" />
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertCode}
          title="Code"
        >
          {'</>'}
        </button>
        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand('createLink', prompt('Enter URL:') || '')}
          title="Link"
        >
          🔗
        </button>

        <button
          type="button"
          className="rte-btn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertImage}
          title="Insert Image"
        >
          🖼️
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="rte-content"
        contentEditable={!disabled}
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        style={{
          minHeight: '100px',
          padding: '12px',
          border: '1px solid #2a2a40',
          borderRadius: '8px',
          backgroundColor: disabled ? '#1a1a2e' : 'rgba(42, 42, 64, 0.6)',
          color: '#e2e8f0',
          outline: 'none',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
};

export default RichTextEditor;

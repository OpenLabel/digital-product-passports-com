import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en', changeLanguage: vi.fn() } }),
}));

// Track a mutable HTML so we can exercise the BUG-02 sync effect
const editorState = { html: '' };
const setContent = vi.fn((html: string) => {
  editorState.html = html;
});

vi.mock('@tiptap/react', () => ({
  useEditor: (opts: { content?: string }) => {
    // seed once
    if (editorState.html === '' && opts?.content) editorState.html = opts.content;
    return {
      isActive: () => false,
      chain: () => ({
        focus: () => ({
          toggleBold: () => ({ run: vi.fn() }),
          toggleItalic: () => ({ run: vi.fn() }),
          toggleUnderline: () => ({ run: vi.fn() }),
          toggleBulletList: () => ({ run: vi.fn() }),
          toggleOrderedList: () => ({ run: vi.fn() }),
          setTextAlign: () => ({ run: vi.fn() }),
          extendMarkRange: () => ({ setLink: () => ({ run: vi.fn() }) }),
          undo: () => ({ run: vi.fn() }),
          redo: () => ({ run: vi.fn() }),
        }),
      }),
      can: () => ({ undo: () => true, redo: () => true }),
      getHTML: () => editorState.html,
      commands: { setContent },
    };
  },
  EditorContent: () => <div data-testid="editor-content">Editor</div>,
}));

import { RichTextEditor } from './RichTextEditor';

describe('RichTextEditor', () => {
  it('renders toolbar and editor', () => {
    render(<RichTextEditor content="<p>Test</p>" onChange={vi.fn()} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('renders all formatting buttons', () => {
    const { container } = render(<RichTextEditor content="" onChange={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(10);
  });

  // BUG-02: late content prop (e.g. hydrated from an async fetch) must sync
  // into the editor via setContent.
  it('syncs late content prop into the editor (BUG-02)', () => {
    editorState.html = '<p>initial</p>';
    setContent.mockClear();
    const { rerender } = render(
      <RichTextEditor content="<p>initial</p>" onChange={vi.fn()} />
    );
    expect(setContent).not.toHaveBeenCalled();
    rerender(<RichTextEditor content="<p>hydrated</p>" onChange={vi.fn()} />);
    expect(setContent).toHaveBeenCalledWith('<p>hydrated</p>', { emitUpdate: false });
  });
});

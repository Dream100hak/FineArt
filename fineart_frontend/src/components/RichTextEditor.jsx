'use client';

import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '내용을 입력해주세요.',
  readOnly = false,
  onUploadImage,
}) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const initializedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const uploadHandlerRef = useRef(onUploadImage);
  const toolbarRef = useRef(null);
  const skipNextSyncRef = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    uploadHandlerRef.current = onUploadImage;
  }, [onUploadImage]);

  useEffect(() => {
    let mounted = true;
    const container = containerRef.current;

    const init = async () => {
      if (initializedRef.current || !containerRef.current) return;
      initializedRef.current = true;

      const Quill = (await import('quill')).default;

      if (toolbarRef.current) {
        toolbarRef.current.remove();
        toolbarRef.current = null;
      }

      containerRef.current.innerHTML = '';
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        readOnly,
        placeholder,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'blockquote', 'image'],
              ['clean'],
            ],
          },
        },
      });

      const editor = quillRef.current;
      if (value) {
        editor.clipboard.dangerouslyPasteHTML(value);
      }

      editor.on('text-change', () => {
        if (!mounted) return;
        const html = editor.root.innerHTML;
        skipNextSyncRef.current = true;
        onChangeRef.current?.(html === '<p><br></p>' ? '' : html);
      });

      const maybeToolbar = containerRef.current.previousSibling;
      if (maybeToolbar && maybeToolbar.classList?.contains('ql-toolbar')) {
        toolbarRef.current = maybeToolbar;
      }

      const toolbar = editor.getModule('toolbar');
      if (toolbar) {
        toolbar.addHandler('image', () => {
          if (readOnly) return;
          if (uploadHandlerRef.current && fileInputRef.current) {
            fileInputRef.current.click();
            return;
          }
          const url = window.prompt('이미지 URL을 입력해주세요');
          if (url) {
            const range = editor.getSelection(true);
            const index = range?.index ?? editor.getLength();
            editor.insertEmbed(index, 'image', url, 'user');
            editor.setSelection(index + 1);
          }
        });
      }
    };

    init();
    return () => {
      mounted = false;
      if (quillRef.current) {
        quillRef.current.off('text-change');
      }
      quillRef.current = null;
      if (container) {
        container.innerHTML = '';
      }
      if (toolbarRef.current) {
        toolbarRef.current.remove();
        toolbarRef.current = null;
      }
      initializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, readOnly]);

  useEffect(() => {
    const editor = quillRef.current;
    if (!editor) return;
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    const current = editor.root.innerHTML;
    const normalizedCurrent = current === '<p><br></p>' ? '' : current;
    const normalizedValue = value ?? '';
    if (normalizedValue !== normalizedCurrent) {
      editor.clipboard.dangerouslyPasteHTML(normalizedValue);
    }
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !uploadHandlerRef.current || !quillRef.current) return;
    try {
      const url = await uploadHandlerRef.current(file);
      if (!url) return;
      const editor = quillRef.current;
      const range = editor.getSelection(true);
      const index = range?.index ?? editor.getLength();
      editor.insertEmbed(index, 'image', url, 'user');
      editor.setSelection(index + 1);
    } catch (error) {
      console.error('[RichTextEditor] Failed to upload image:', error);
    }
  };

  return (
    <>
      <div ref={containerRef} className="min-h-[300px]" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}

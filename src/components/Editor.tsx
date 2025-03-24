import React, { useEffect, useRef } from 'react';

// 声明全局 tinymce
declare global {
  interface Window {
    tinymce: any;
  }
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (window.tinymce && !initRef.current) {
      initRef.current = true;
      const XSTAGE_DOCUMENT_URL = import.meta.env.VITE_DOCUMENT_URL || '';
      const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || '';

      window.tinymce.init({
        selector: '#tinymceId',
        language: 'zh_CN',
        language_url: '/libs/tinymce/langs/zh_CN.js',
        plugins: 'lists advlist bbcode link hr table image',
        toolbar:
          'bullist numlist undo redo | bold italic underline link hr table forecolor image',
        branding: false,
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        quickbars_selection_toolbar:
          'bold italic forecolor | link blockquote quickimage',
        images_upload_handler: (
          blobInfo: any,
          success: Function,
          failure: Function,
        ) => {
          const file = blobInfo.blob();
          const formData = new FormData();
          formData.append('file', file);
          fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.code === 1) {
                const findIndex = response.msg.indexOf('|');
                const attachment = response.msg.substring(0, findIndex);
                success(XSTAGE_DOCUMENT_URL + attachment);
              } else {
                failure(response);
              }
            })
            .catch((error) => failure(error));
        },
        init_instance_callback: (editor: any) => {
          editorRef.current = editor;

          // 初始化时设置内容
          if (value) {
            editor.setContent(value);
          }
        },
        setup: (editor: any) => {
          editor.on('change', () => {
            const content = editor.getContent();
            onChange(content);
          });
        },
      });

      // 组件卸载时清理
      return () => {
        if (window.tinymce && editorRef.current) {
          window.tinymce.remove(editorRef.current);
          initRef.current = false;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (window.tinymce && editorRef.current && initRef.current) {
      const currentContent = editorRef.current.getContent();
      if (value !== currentContent) {
        editorRef.current.setContent(value);
      }
    }
  }, [value]);

  return <div id="tinymceId" className="min-h-[500px] w-full"></div>;
};

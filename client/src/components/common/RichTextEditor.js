import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Box,
  Toolbar,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Clear
} from '@mui/icons-material';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing your content..." }) => {
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'image',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Toolbar sx={{ 
        backgroundColor: 'background.paper', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        gap: 0.5,
        flexWrap: 'wrap'
      }}>
        {/* Text Formatting */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive('bold') ? 'primary' : 'default'}
        >
          <FormatBold />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive('italic') ? 'primary' : 'default'}
        >
          <FormatItalic />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={editor.isActive('strike') ? 'primary' : 'default'}
        >
          <FormatStrikethrough />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Lists */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive('bulletList') ? 'primary' : 'default'}
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive('orderedList') ? 'primary' : 'default'}
        >
          <FormatListNumbered />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Block Elements */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={editor.isActive('blockquote') ? 'primary' : 'default'}
        >
          <FormatQuote />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          color={editor.isActive('codeBlock') ? 'primary' : 'default'}
        >
          <Code />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Media */}
        <IconButton
          size="small"
          onClick={addLink}
          color={editor.isActive('link') ? 'primary' : 'default'}
        >
          <LinkIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={addImage}
        >
          <ImageIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* History */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Clear */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().clearContent().run()}
        >
          <Clear />
        </IconButton>
      </Toolbar>

      {/* Editor Content */}
      <Box sx={{ 
        minHeight: 300, 
        maxHeight: 500, 
        overflow: 'auto',
        p: 2,
        '& .ProseMirror': {
          outline: 'none',
          minHeight: 250,
          '& p': {
            margin: '0.5em 0',
            lineHeight: 1.6,
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '1em 0 0.5em 0',
            fontWeight: 600,
          },
          '& ul, & ol': {
            paddingLeft: '1.5em',
            margin: '0.5em 0',
          },
          '& blockquote': {
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            margin: '1em 0',
            paddingLeft: '1em',
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
          },
          '& code': {
            backgroundColor: theme.palette.grey[100],
            padding: '0.2em 0.4em',
            borderRadius: 3,
            fontSize: '0.9em',
          },
          '& pre': {
            backgroundColor: theme.palette.grey[100],
            padding: '1em',
            borderRadius: 4,
            overflow: 'auto',
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
          '& .link': {
            color: theme.palette.primary.main,
            textDecoration: 'underline',
            '&:hover': {
              color: theme.palette.primary.dark,
            },
          },
          '& .image': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 4,
          },
          '& .is-editor-empty:first-of-type::before': {
            color: theme.palette.text.disabled,
            content: `attr(data-placeholder)`,
            float: 'left',
            height: 0,
            pointerEvents: 'none',
          },
        },
      }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default RichTextEditor; 
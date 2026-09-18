"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  useEditor,
  EditorContent,
  Extension,
  Node as TiptapNode,
  mergeAttributes,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Undo2,
  Redo2,
  Code2,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Minus,
  RemoveFormatting,
  X,
  BookOpen,
  Sparkles,
  Quote,
  Layers,
  ChevronDown,
} from "lucide-react";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { toast } from "@/components/admin/Toast";
import { CustomSelect } from "./CustomSelect";
import { EditorChromeSkeleton } from "./AdminSkeletons";

export interface TiptapEditorHandle {
  insertHTML: (html: string) => void;
  focus: () => void;
}

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type ImageAltModalState =
  | { mode: "insert"; src: string }
  | { mode: "edit"; src: string; alt: string }
  | null;

const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Default Font" },
  { value: "'Cormorant Garamond', serif", label: "Cormorant Garamond" },
  { value: "'Marcellus', serif", label: "Classical Marcellus" },
  { value: "'Lora', serif", label: "Editorial Lora" },
  { value: "'Montserrat', sans-serif", label: "Modern Montserrat" },
  { value: "var(--font-amiri), serif", label: "Arabic Amiri (عربي)" },
  { value: "var(--font-noto-nastaliq), serif", label: "Urdu Nastaliq (اردو)" },
  { value: "var(--font-manrope), sans-serif", label: "Manrope Sans" },
  { value: "var(--font-inter), sans-serif", label: "Clean Inter" },
];

const FONT_SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Size" },
  { value: "13px", label: "13px" },
  { value: "14px", label: "14px" },
  { value: "15px", label: "15px" },
  { value: "16px", label: "16px" },
  { value: "18px", label: "18px" },
  { value: "20px", label: "20px" },
  { value: "24px", label: "24px" },
  { value: "28px", label: "28px" },
  { value: "32px", label: "32px" },
  { value: "40px", label: "40px" },
];

const PreserveCard = TiptapNode.create({
  name: "preserveCard",
  group: "block",
  content: "block*",
  defining: true,
  parseHTML() {
    return [
      { tag: "div[data-quran]" },
      { tag: "div[data-hadith]" },
      { tag: "div[data-dua]" },
      { tag: "div[data-callout]" },
      { tag: "div.quran-quote-card" },
      { tag: "div.hadith-quote-card" },
      { tag: "div.dua-card" },
      { tag: "div.islamic-callout" },
    ];
  },
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) =>
          attributes.class ? { class: attributes.class } : {},
      },
      dir: {
        default: null,
        parseHTML: (element) => element.getAttribute("dir"),
        renderHTML: (attributes) =>
          attributes.dir ? { dir: attributes.dir } : {},
      },
      "data-quran": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-quran"),
        renderHTML: (attributes) =>
          attributes["data-quran"] != null
            ? { "data-quran": attributes["data-quran"] }
            : {},
      },
      "data-hadith": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-hadith"),
        renderHTML: (attributes) =>
          attributes["data-hadith"] != null
            ? { "data-hadith": attributes["data-hadith"] }
            : {},
      },
      "data-dua": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-dua"),
        renderHTML: (attributes) =>
          attributes["data-dua"] != null
            ? { "data-dua": attributes["data-dua"] }
            : {},
      },
      "data-callout": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-callout"),
        renderHTML: (attributes) =>
          attributes["data-callout"] != null
            ? { "data-callout": attributes["data-callout"] }
            : {},
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },
});
const TextDirection = Extension.create({
  name: "textDirection",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "listItem", "blockquote"],
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => element.getAttribute("dir"),
            renderHTML: (attributes) => {
              if (!attributes.dir) return {};
              return {
                dir: attributes.dir,
                style: `direction:${attributes.dir};text-align:${
                  attributes.dir === "rtl" ? "right" : "left"
                };`,
              };
            },
          },
        },
      },
    ];
  },
});

const ToolbarButton = ({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`h-8 min-w-8 px-2 inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
      active
        ? "bg-emerald-100 text-emerald-800 font-bold"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;

export const TiptapEditor = forwardRef<TiptapEditorHandle, TiptapEditorProps>(
  function TiptapEditor(
    { value, onChange, placeholder = "Start writing your article content here...", minHeight = "540px" },
    ref
  ) {
    const [showSource, setShowSource] = useState(false);
    const [sourceValue, setSourceValue] = useState(value || "");
    const [uploading, setUploading] = useState(false);
    const [imageAltModal, setImageAltModal] = useState<ImageAltModalState>(null);
    const [altDraft, setAltDraft] = useState("");
    const [modalMounted, setModalMounted] = useState(false);
    const [showIslamicMenu, setShowIslamicMenu] = useState(false);
    const [, setSelectionTick] = useState(0);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const altInputRef = useRef<HTMLInputElement>(null);
    const islamicMenuRef = useRef<HTMLDivElement>(null);
    const openAltModalRef = useRef<(state: Exclude<ImageAltModalState, null>) => void>(
      () => {}
    );

    useEffect(() => setModalMounted(true), []);

    // Close islamic menu on outside click
    useEffect(() => {
      const handleOutside = (e: MouseEvent) => {
        if (
          islamicMenuRef.current &&
          !islamicMenuRef.current.contains(e.target as HTMLElement)
        ) {
          setShowIslamicMenu(false);
        }
      };
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
          link: false,
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class: "text-emerald-700 underline underline-offset-2 hover:text-emerald-900 font-medium",
            rel: "noopener noreferrer",
          },
        }),
        PreserveCard,
        TiptapImage.configure({ inline: false, allowBase64: false }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TextStyle,
        FontFamily,
        FontSize,
        Subscript,
        Superscript,
        TableKit.configure({ table: { resizable: true } }),
        TextDirection,
        Placeholder.configure({
          placeholder,
          emptyEditorClass:
            "before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none before:absolute before:top-4 before:left-5",
        }),
      ],
      content: value || "<p></p>",
      editorProps: {
        attributes: {
          class:
            "tiptap-content focus:outline-none min-h-[500px] px-6 py-5 text-gray-800 leading-relaxed text-[17px] font-sans",
        },
        handleDoubleClickOn: (_view, _pos, node) => {
          if (node.type.name !== "image") return false;
          openAltModalRef.current({
            mode: "edit",
            src: (node.attrs.src as string) || "",
            alt: (node.attrs.alt as string) || "",
          });
          return true;
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      insertHTML: (html: string) => {
        editor?.chain().focus().insertContent(html).run();
      },
      focus: () => editor?.chain().focus().run(),
    }));

    // Sync external value
    useEffect(() => {
      if (!editor) return;
      const current = editor.getHTML();
      if (value !== undefined && value !== current) {
        editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
      }
    }, [editor, value]);

    useEffect(() => {
      if (!editor) return;
      const syncToolbar = () => setSelectionTick((n) => n + 1);
      editor.on("selectionUpdate", syncToolbar);
      editor.on("transaction", syncToolbar);
      return () => {
        editor.off("selectionUpdate", syncToolbar);
        editor.off("transaction", syncToolbar);
      };
    }, [editor]);

    useEffect(() => {
      if (!imageAltModal) return;
      const timer = window.setTimeout(() => altInputRef.current?.focus(), 60);
      return () => window.clearTimeout(timer);
    }, [imageAltModal]);

    if (!editor) {
      return <EditorChromeSkeleton minHeight={minHeight} />;
    }

    const openAltModal = (state: Exclude<ImageAltModalState, null>) => {
      setAltDraft(state.mode === "edit" ? state.alt : "");
      setImageAltModal(state);
    };
    openAltModalRef.current = openAltModal;

    const closeAltModal = () => {
      setImageAltModal(null);
      setAltDraft("");
    };

    const applyImageAlt = () => {
      if (!imageAltModal) return;
      const alt = altDraft.trim();
      if (imageAltModal.mode === "insert") {
        editor
          .chain()
          .focus()
          .setImage({ src: imageAltModal.src, alt: alt || undefined })
          .run();
        toast.success("Image added to content.");
      } else {
        editor
          .chain()
          .focus()
          .updateAttributes("image", { alt: alt || null })
          .run();
        toast.success("Image alt text updated.");
      }
      closeAltModal();
    };

    const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const result = await uploadClientImage(file);
        if (result.success && result.imageUrl) {
          openAltModal({ mode: "insert", src: result.imageUrl });
        } else {
          toast.error(result.error || "Failed to upload image");
        }
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };

    const setLink = () => {
      const previous = editor.getAttributes("link").href as string | undefined;
      const url = window.prompt("Enter link URL (e.g. https://...):", previous || "https://");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().unsetLink().run();
        return;
      }
      editor.chain().focus().setLink({ href: url }).run();
    };

    const toggleRTL = () => {
      const isRTL =
        editor.getAttributes("paragraph").dir === "rtl" ||
        editor.getAttributes("heading").dir === "rtl";
      editor
        .chain()
        .focus()
        .updateAttributes("paragraph", { dir: isRTL ? null : "rtl" })
        .updateAttributes("heading", { dir: isRTL ? null : "rtl" })
        .run();
    };

    const toggleSource = () => {
      if (!showSource) {
        setSourceValue(editor.getHTML());
        setShowSource(true);
      } else {
        editor.commands.setContent(sourceValue || "<p></p>");
        onChange(sourceValue);
        setShowSource(false);
      }
    };

    // Quick Insert Islamic Blocks
    const insertQuranSnippet = () => {
      const arabic = window.prompt("Enter Arabic text (optional):", "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ") || "";
      const trans = window.prompt("Enter Translation:", "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.") || "";
      const ref = window.prompt("Surah & Ayah reference:", "Surah Al-Baqarah (2:201)") || "";
      
      const html = `
        <div class="quran-quote-card my-8 p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 shadow-xs" data-quran="true">
          ${arabic ? `<p class="text-right font-serif text-2xl sm:text-3xl text-emerald-950 mb-3 leading-loose" dir="rtl">${arabic}</p>` : ""}
          <p class="text-base sm:text-lg text-gray-800 italic leading-relaxed mb-3">"${trans}"</p>
          <div class="text-xs font-bold uppercase tracking-wider text-emerald-800">— ${ref}</div>
        </div>
      `;
      editor.chain().focus().insertContent(html).run();
      setShowIslamicMenu(false);
      toast.success("Quran verse card inserted");
    };

    const insertHadithSnippet = () => {
      const text = window.prompt("Enter Hadith text:", "The best among you are those who have the best manners and character.") || "";
      const source = window.prompt("Hadith Source:", "Sahih al-Bukhari 6029") || "";
      const grade = window.prompt("Grade (optional):", "Sahih") || "";

      const html = `
        <div class="hadith-quote-card my-8 p-6 rounded-2xl border-2 border-teal-300 bg-teal-50/70 shadow-xs" data-hadith="true">
          <p class="text-base sm:text-lg text-gray-800 italic leading-relaxed mb-3">"${text}"</p>
          <div class="text-xs font-bold uppercase tracking-wider text-teal-800">— ${source}${grade ? ` · Grade: ${grade}` : ""}</div>
        </div>
      `;
      editor.chain().focus().insertContent(html).run();
      setShowIslamicMenu(false);
      toast.success("Hadith card inserted");
    };

    const insertDuaSnippet = () => {
      const title = window.prompt("Dua Title:", "Dua for Traveling") || "";
      const arabic = window.prompt("Arabic text:", "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ") || "";
      const trans = window.prompt("Translation:", "Glory to Him who has subjected this to us, and we could never have done it by ourselves.") || "";

      const html = `
        <div class="dua-card my-8 p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/70 shadow-xs" data-dua="true">
          <div class="text-xs font-bold uppercase tracking-widest text-amber-800 mb-2">${title}</div>
          <p class="text-right font-serif text-2xl text-amber-950 mb-3 leading-loose" dir="rtl">${arabic}</p>
          <p class="text-sm sm:text-base text-gray-800 leading-relaxed">${trans}</p>
        </div>
      `;
      editor.chain().focus().insertContent(html).run();
      setShowIslamicMenu(false);
      toast.success("Dua card inserted");
    };

    const insertCalloutSnippet = (variant: "tip" | "warning" | "note") => {
      const colors = {
        tip: "border-emerald-300 bg-emerald-50 text-emerald-900",
        warning: "border-amber-300 bg-amber-50 text-amber-900",
        note: "border-blue-300 bg-blue-50 text-blue-900",
      }[variant];

      const html = `
        <div class="islamic-callout my-6 p-5 rounded-2xl border-2 ${colors} shadow-xs" data-callout="${variant}">
          <div class="font-bold text-sm mb-1">${variant.toUpperCase()}</div>
          <p class="text-sm leading-relaxed">Write your guidance or practical advisory here...</p>
        </div>
      `;
      editor.chain().focus().insertContent(html).run();
      setShowIslamicMenu(false);
      toast.success(`${variant.toUpperCase()} callout inserted`);
    };

    const currentBlock = editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
      ? "h3"
      : editor.isActive("heading", { level: 4 })
      ? "h4"
      : editor.isActive("heading", { level: 5 })
      ? "h5"
      : editor.isActive("heading", { level: 6 })
      ? "h6"
      : "p";

    const applyBlock = (val: string) => {
      const chain = editor.chain().focus();
      if (val === "p") {
        chain.setParagraph().run();
      } else {
        const level = Number(val.replace("h", "")) as 2 | 3 | 4 | 5 | 6;
        chain.toggleHeading({ level }).run();
      }
    };

    const currentFont = (editor.getAttributes("textStyle").fontFamily || "") as string;
    const currentSize = (editor.getAttributes("textStyle").fontSize || "") as string;

    // Word and character counts
    const textContent = editor.state.doc.textContent;
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const charCount = textContent.length;
    const estReadingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
      <div className="tiptap-editor border border-gray-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        {/* Sticky Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2.5 border-b border-gray-200 bg-gray-50/90 backdrop-blur-xs sticky top-0 z-20">
          {/* Block Selector */}
          <CustomSelect
            size="sm"
            className="w-32"
            dropdownClassName="w-36"
            value={currentBlock}
            onChange={applyBlock}
            options={[
              { value: "p", label: "Paragraph" },
              { value: "h2", label: "Heading 2" },
              { value: "h3", label: "Heading 3" },
              { value: "h4", label: "Heading 4" },
              { value: "h5", label: "Heading 5" },
              { value: "h6", label: "Heading 6" },
            ]}
          />

          {/* Font Family Selector */}
          <CustomSelect
            size="sm"
            className="w-40"
            dropdownClassName="w-56"
            value={currentFont}
            onChange={(v) => {
              if (v) editor.chain().focus().setFontFamily(v).run();
              else editor.chain().focus().unsetFontFamily().run();
            }}
            options={FONT_OPTIONS.map((f) => ({
              value: f.value,
              label: f.label,
              fontFamily: f.value,
            }))}
          />

          {/* Font Size Selector */}
          <CustomSelect
            size="sm"
            className="w-24"
            dropdownClassName="w-28"
            value={currentSize}
            onChange={(v) => {
              if (v) editor.chain().focus().setFontSize(v).run();
              else editor.chain().focus().unsetFontSize().run();
            }}
            options={FONT_SIZE_OPTIONS.map((f) => ({
              value: f.value,
              label: f.label,
            }))}
          />

          <Divider />

          {/* Formatting Controls */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            active={editor.isActive("superscript")}
            title="Superscript"
          >
            <SuperscriptIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            active={editor.isActive("subscript")}
            title="Subscript"
          >
            <SubscriptIcon className="w-3.5 h-3.5" />
          </ToolbarButton>

          <Divider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>

          <Divider />

          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* RTL Direction Toggle */}
          <ToolbarButton
            onClick={toggleRTL}
            title="Toggle Right-to-Left Direction (Arabic / Urdu)"
          >
            <span className="text-[11px] font-bold tracking-tight">RTL</span>
          </ToolbarButton>

          <Divider />

          {/* Link */}
          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Insert / Edit Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* Inline Image Upload */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
          <ToolbarButton
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            title="Insert Image (Upload directly to content)"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* Table Insertion */}
          <ToolbarButton
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            title="Insert Table (3x3 grid)"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* Islamic Snippets Quick Menu */}
          <div className="relative" ref={islamicMenuRef}>
            <button
              type="button"
              onClick={() => setShowIslamicMenu((p) => !p)}
              className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer"
              title="Insert Islamic Blocks"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Islamic Inserts</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showIslamicMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-56 rounded-xl bg-white border border-gray-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={insertQuranSnippet}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>☽ Quran Verse Card</span>
                </button>
                <button
                  type="button"
                  onClick={insertHadithSnippet}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Quote className="w-4 h-4 text-teal-600" />
                  <span>📖 Hadith Quote Card</span>
                </button>
                <button
                  type="button"
                  onClick={insertDuaSnippet}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>🤲 Dua Card</span>
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  type="button"
                  onClick={() => insertCalloutSnippet("tip")}
                  className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>💡 Islamic Tip Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCalloutSnippet("warning")}
                  className="w-full px-3.5 py-1.5 text-left text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>⚠️ Guidance Note</span>
                </button>
              </div>
            )}
          </div>

          <Divider />

          {/* Horizontal Rule */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* Clear Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* HTML Source Toggle */}
          <ToolbarButton
            onClick={toggleSource}
            active={showSource}
            title="View / Edit Raw HTML Source"
          >
            <Code2 className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        {/* Editing Surface */}
        <div style={{ minHeight }} className="relative bg-white">
          {showSource ? (
            <textarea
              value={sourceValue}
              onChange={(e) => setSourceValue(e.target.value)}
              className="w-full h-full min-h-[500px] p-5 font-mono text-xs text-gray-900 bg-gray-50/50 outline-none resize-y border-none"
              spellCheck={false}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>

        {/* Bottom Bar: Word Count & Stats */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/60 text-xs text-gray-500">
          <div className="flex items-center gap-3 font-medium">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span>~{estReadingTime} min read</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Double-click any image to edit its ALT text
          </div>
        </div>

        {/* Image Alt Text Modal */}
        {imageAltModal && modalMounted &&
          createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
              onClick={closeAltModal}
              role="presentation"
            >
              <div
                className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  onClick={closeAltModal}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      SEO & Accessibility
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      {imageAltModal.mode === "insert"
                        ? "Add Image Alt Text"
                        : "Edit Image Alt Text"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Describe what appears in this image for Google search indexing and screen readers.
                    </p>
                  </div>

                  {imageAltModal.src && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageAltModal.src}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Alt Description
                    </label>
                    <input
                      ref={altInputRef}
                      type="text"
                      value={altDraft}
                      onChange={(e) => setAltDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyImageAlt();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          closeAltModal();
                        }
                      }}
                      placeholder="e.g. Kaaba in Masjid al-Haram during tawaf at sunset"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:border-emerald-500 focus:bg-white outline-none text-gray-900 text-xs font-medium transition-colors"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (imageAltModal.mode === "insert") {
                          setAltDraft("");
                          editor
                            .chain()
                            .focus()
                            .setImage({ src: imageAltModal.src })
                            .run();
                          toast.success("Image added without alt text");
                          closeAltModal();
                        } else {
                          closeAltModal();
                        }
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {imageAltModal.mode === "insert" ? "Skip" : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={applyImageAlt}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                    >
                      {imageAltModal.mode === "insert"
                        ? "Insert Image"
                        : "Save Alt Text"}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  }
);

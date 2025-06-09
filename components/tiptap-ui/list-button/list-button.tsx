"use client";

import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { ListIcon, ListOrderedIcon, ListTodoIcon } from "lucide-react";

// --- Lib ---
import { isNodeInSchema } from "@/lib/tiptap-utils";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export type ListType = "bulletList" | "orderedList" | "taskList";

export interface ListOption {
  label: string;
  type: ListType;
  icon: React.ElementType;
}

export interface ListButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null;
  /**
   * The type of list to toggle.
   */
  type: ListType;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * Whether the button should hide when the list is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

export const listOptions: ListOption[] = [
  {
    label: "Bullet List",
    type: "bulletList",
    icon: ListIcon,
  },
  {
    label: "Ordered List",
    type: "orderedList",
    icon: ListOrderedIcon,
  },
  {
    label: "Task List",
    type: "taskList",
    icon: ListTodoIcon,
  },
];

export const listShortcutKeys: Record<ListType, string> = {
  bulletList: "Ctrl-Shift-8",
  orderedList: "Ctrl-Shift-7",
  taskList: "Ctrl-Shift-9",
};

export function canToggleList(editor: Editor | null, type: ListType): boolean {
  if (!editor) {
    return false;
  }

  switch (type) {
    case "bulletList":
      return editor.can().toggleBulletList();
    case "orderedList":
      return editor.can().toggleOrderedList();
    case "taskList":
      return editor.can().toggleList("taskList", "taskItem");
    default:
      return false;
  }
}

export function isListActive(editor: Editor | null, type: ListType): boolean {
  if (!editor) return false;

  switch (type) {
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    case "taskList":
      return editor.isActive("taskList");
    default:
      return false;
  }
}

export function toggleList(editor: Editor | null, type: ListType): void {
  if (!editor) return;

  switch (type) {
    case "bulletList":
      editor.chain().focus().toggleBulletList().run();
      break;
    case "orderedList":
      editor.chain().focus().toggleOrderedList().run();
      break;
    case "taskList":
      editor.chain().focus().toggleList("taskList", "taskItem").run();
      break;
  }
}

export function getListOption(type: ListType): ListOption | undefined {
  return listOptions.find((option) => option.type === type);
}

export function shouldShowListButton(params: {
  editor: Editor | null;
  type: ListType;
  hideWhenUnavailable: boolean;
  listInSchema: boolean;
}): boolean {
  const { editor, type, hideWhenUnavailable, listInSchema } = params;

  if (!listInSchema || !editor) {
    return false;
  }

  if (hideWhenUnavailable) {
    if (
      isNodeSelection(editor.state.selection) ||
      !canToggleList(editor, type)
    ) {
      return false;
    }
  }

  return true;
}

export function useListState(editor: Editor | null, type: ListType) {
  const listInSchema = isNodeInSchema(type, editor);
  const listOption = getListOption(type);
  const isActive = isListActive(editor, type);
  const shortcutKey = listShortcutKeys[type];

  return {
    listInSchema,
    listOption,
    isActive,
    shortcutKey,
  };
}

export const ListButton = React.forwardRef<HTMLButtonElement, ListButtonProps>(
  ({
    editor: providedEditor,
    type,
    hideWhenUnavailable = false,
    onClick,
    text,
  }) => {
    const editor = useTiptapEditor(providedEditor);
    const { listInSchema, listOption } = useListState(editor, type);

    const Icon = listOption?.icon || ListIcon;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.defaultPrevented && editor) {
          toggleList(editor, type);
        }
      },
      [onClick, editor, type],
    );

    const show = React.useMemo(() => {
      return shouldShowListButton({
        editor,
        type,
        hideWhenUnavailable,
        listInSchema,
      });
    }, [editor, type, hideWhenUnavailable, listInSchema]);

    if (!show || !editor || !editor.isEditable) {
      return null;
    }

    return (
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={(e) => handleClick(e)}
      >
        <Icon />
        {text && <span>{text}</span>}
      </DropdownMenuItem>
    );
  },
);

ListButton.displayName = "ListButton";

export default ListButton;

"use client";

import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Lib ---
import { isNodeInSchema } from "@/lib/tiptap-utils";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
} from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingButtonProps extends Omit<ButtonProps, "type"> {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null;
  /**
   * The heading level.
   */
  level: Level;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * Whether the button should hide when the heading is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

export const headingIcons = {
  1: Heading1Icon,
  2: Heading2Icon,
  3: Heading3Icon,
  4: Heading4Icon,
  5: Heading5Icon,
  6: Heading6Icon,
};

export const headingShortcutKeys: Partial<Record<Level, string>> = {
  1: "Ctrl-Alt-1",
  2: "Ctrl-Alt-2",
  3: "Ctrl-Alt-3",
  4: "Ctrl-Alt-4",
  5: "Ctrl-Alt-5",
  6: "Ctrl-Alt-6",
};

export function canToggleHeading(editor: Editor | null, level: Level): boolean {
  if (!editor) return false;

  try {
    return editor.can().toggleNode("heading", "paragraph", { level });
  } catch {
    return false;
  }
}

export function isHeadingActive(editor: Editor | null, level: Level): boolean {
  if (!editor) return false;
  return editor.isActive("heading", { level });
}

export function toggleHeading(editor: Editor | null, level: Level): void {
  if (!editor) return;

  if (editor.isActive("heading", { level })) {
    editor.chain().focus().setNode("paragraph").run();
  } else {
    editor.chain().focus().toggleNode("heading", "paragraph", { level }).run();
  }
}

export function isHeadingButtonDisabled(
  editor: Editor | null,
  level: Level,
  userDisabled: boolean = false,
): boolean {
  if (!editor) return true;
  if (userDisabled) return true;
  if (!canToggleHeading(editor, level)) return true;
  return false;
}

export function shouldShowHeadingButton(params: {
  editor: Editor | null;
  level: Level;
  hideWhenUnavailable: boolean;
  headingInSchema: boolean;
}): boolean {
  const { editor, hideWhenUnavailable, headingInSchema } = params;

  if (!headingInSchema || !editor) {
    return false;
  }

  if (hideWhenUnavailable) {
    if (isNodeSelection(editor.state.selection)) {
      return false;
    }
  }

  return true;
}

export function getFormattedHeadingName(level: Level): string {
  return `Heading ${level}`;
}

export function useHeadingState(
  editor: Editor | null,
  level: Level,
  disabled: boolean = false,
) {
  const headingInSchema = isNodeInSchema("heading", editor);
  const isDisabled = isHeadingButtonDisabled(editor, level, disabled);
  const isActive = isHeadingActive(editor, level);

  const Icon = headingIcons[level];
  const shortcutKey = headingShortcutKeys[level];
  const formattedName = getFormattedHeadingName(level);

  return {
    headingInSchema,
    isDisabled,
    isActive,
    Icon,
    shortcutKey,
    formattedName,
  };
}

export const HeadingButton = React.forwardRef<
  HTMLDivElement,
  HeadingButtonProps
>(
  ({
    editor: providedEditor,
    level,
    text,
    hideWhenUnavailable = false,
    disabled,
    onClick,
  }) => {
    const editor = useTiptapEditor(providedEditor);

    const { headingInSchema, isDisabled, Icon } = useHeadingState(
      editor,
      level,
      disabled,
    );

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.defaultPrevented && !isDisabled && editor) {
          toggleHeading(editor, level);
        }
      },
      [onClick, isDisabled, editor, level],
    );

    const show = React.useMemo(() => {
      return shouldShowHeadingButton({
        editor,
        level,
        hideWhenUnavailable,
        headingInSchema,
      });
    }, [editor, level, hideWhenUnavailable, headingInSchema]);

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

HeadingButton.displayName = "HeadingButton";

export default HeadingButton;

"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button as ShadButton } from "@/components/ui/button";

type PlatformShortcuts = Record<string, string>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  showTooltip?: boolean;
  tooltip?: React.ReactNode;
  shortcutKeys?: string;
}

export const MAC_SYMBOLS: PlatformShortcuts = {
  ctrl: "⌘",
  alt: "⌥",
  shift: "⇧",
} as const;

export const formatShortcutKey = (key: string, isMac: boolean) => {
  if (isMac) {
    const lowerKey = key.toLowerCase();
    return MAC_SYMBOLS[lowerKey] || key.toUpperCase();
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
};

export const parseShortcutKeys = (
  shortcutKeys: string | undefined,
  isMac: boolean,
) => {
  if (!shortcutKeys) return [];

  return shortcutKeys
    .split("-")
    .map((key) => key.trim())
    .map((key) => formatShortcutKey(key, isMac));
};

export const ShortcutDisplay: React.FC<{ shortcuts: string[] }> = ({
  shortcuts,
}) => {
  if (shortcuts.length === 0) return null;

  return (
    <div className="text-center text-muted-foreground pointer-events-none">
      {shortcuts.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <kbd>+</kbd>}
          <kbd>{key}</kbd>
        </React.Fragment>
      ))}
    </div>
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      children,
      tooltip,
      showTooltip = true,
      shortcutKeys,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isMac = React.useMemo(
      () =>
        typeof navigator !== "undefined" &&
        navigator.platform.toLowerCase().includes("mac"),
      [],
    );

    const shortcuts = React.useMemo(
      () => parseShortcutKeys(shortcutKeys, isMac),
      [shortcutKeys, isMac],
    );

    if (!tooltip || !showTooltip) {
      return (
        <ShadButton
          className={`cursor-pointer ${className}`.trim()}
          ref={ref}
          size={"icon"}
          variant={"outline"}
          aria-label={ariaLabel}
          {...props}
        >
          {children}
        </ShadButton>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger
          className={`cursor-pointer  ${className}`.trim()}
          ref={ref}
          asChild
          aria-label={ariaLabel}
          {...props}
        >
          <ShadButton
            size={"icon"}
            variant={props["aria-pressed"] ? "default" : "ghost"}
          >
            {children}
          </ShadButton>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-center">{tooltip}</p>
          <ShortcutDisplay shortcuts={shortcuts} />
        </TooltipContent>
      </Tooltip>
    );
  },
);

Button.displayName = "Button";

export default Button;

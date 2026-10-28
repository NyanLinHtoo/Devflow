"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useFormFieldContext } from "../form-field/context";

export type SelectOption = {
	value: string;
	label: string;
};

type SelectProps = {
	id?: string;
	value: string | null;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	"aria-label"?: string;
};

export function Select({
	id,
	value,
	onChange,
	options,
	placeholder = "Select...",
	disabled,
	className = "",
	"aria-label": ariaLabel,
}: SelectProps) {
	const field = useFormFieldContext();
	const [open, setOpen] = useState(false);
	const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const listboxId = useId();

	const selected = options.find((option) => option.value === value) ?? null;

	useEffect(() => {
		if (!open) {
			return;
		}

		function handlePointerDown(event: PointerEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);

		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [open]);

	function openList() {
		if (disabled) {
			return;
		}

		const index = options.findIndex((option) => option.value === value);
		const rect = containerRef.current?.getBoundingClientRect();

		setHighlightedIndex(index >= 0 ? index : 0);
		setPlacement(
			rect && window.innerHeight - rect.bottom < 240 ? "top" : "bottom",
		);
		setOpen(true);
	}

	function commit(index: number) {
		const option = options[index];

		if (!option) {
			return;
		}

		onChange(option.value);
		setOpen(false);
		triggerRef.current?.focus();
	}

	function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		if (disabled) {
			return;
		}

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();

			if (!open) {
				openList();
				return;
			}

			const delta = event.key === "ArrowDown" ? 1 : -1;

			setHighlightedIndex((previous) => {
				const next = previous + delta;

				if (next < 0) {
					return options.length - 1;
				}

				if (next >= options.length) {
					return 0;
				}

				return next;
			});

			return;
		}

		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();

			if (!open) {
				openList();
				return;
			}

			commit(highlightedIndex);
			return;
		}

		if (event.key === "Escape" || event.key === "Tab") {
			setOpen(false);
		}
	}

	return (
		<div ref={containerRef} className={["relative", className].join(" ")}>
			<button
				ref={triggerRef}
				type="button"
				id={id}
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={open ? listboxId : undefined}
				aria-activedescendant={
					open && highlightedIndex >= 0
						? `${listboxId}-${highlightedIndex}`
						: undefined
				}
				aria-label={ariaLabel}
				aria-describedby={field?.hasMessage ? field.messageId : undefined}
				onClick={() => (open ? setOpen(false) : openList())}
				onKeyDown={handleKeyDown}
				className={[
					"flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-left text-base text-foreground",
					"transition-colors sm:text-sm",
					"pointer-coarse:min-h-11",
					"disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
					open ? "border-primary" : "",
				].join(" ")}>
				<span
					className={selected ? "truncate" : "truncate text-muted-foreground"}>
					{selected ? selected.label : placeholder}
				</span>

				<ChevronDown
					size={16}
					aria-hidden="true"
					className={[
						"shrink-0 text-muted-foreground transition-transform",
						open ? "rotate-180" : "",
					].join(" ")}
				/>
			</button>

			{open ? (
				<ul
					id={listboxId}
					role="listbox"
					className={[
						"absolute left-0 z-50 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-surface p-1 shadow-lg",
						placement === "top" ? "bottom-full mb-1" : "top-full mt-1",
					].join(" ")}>
					{options.map((option, index) => {
						const isSelected = option.value === value;
						const isHighlighted = index === highlightedIndex;

						return (
							<li
								key={option.value}
								id={`${listboxId}-${index}`}
								role="option"
								aria-selected={isSelected}
								onMouseEnter={() => setHighlightedIndex(index)}
								onMouseDown={(event) => event.preventDefault()}
								onClick={() => commit(index)}
								className={[
									"flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 text-sm text-foreground",
									isHighlighted ? "bg-surface-muted" : "",
									isSelected ? "font-medium" : "",
								].join(" ")}>
								<span className="truncate">{option.label}</span>

								{isSelected ? (
									<Check size={14} className="shrink-0 text-primary" />
								) : null}
							</li>
						);
					})}
				</ul>
			) : null}
		</div>
	);
}

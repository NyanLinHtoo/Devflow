"use client";

import {
	createContext,
	useContext,
	useEffect,
	useSyncExternalStore,
	type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const listeners = new Set<() => void>();

function emitThemeChange() {
	listeners.forEach((listener) => listener());
}

function subscribeToTheme(listener: () => void) {
	const media = window.matchMedia("(prefers-color-scheme: dark)");

	function handleSystemChange() {
		if (!window.localStorage.getItem("theme")) {
			listener();
		}
	}

	listeners.add(listener);
	media.addEventListener("change", handleSystemChange);

	return () => {
		listeners.delete(listener);
		media.removeEventListener("change", handleSystemChange);
	};
}

function getClientTheme(): Theme {
	const stored = window.localStorage.getItem("theme");

	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function getServerTheme(): Theme {
	return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useSyncExternalStore(
		subscribeToTheme,
		getClientTheme,
		getServerTheme,
	);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	function setTheme(nextTheme: Theme) {
		window.localStorage.setItem("theme", nextTheme);
		emitThemeChange();
	}

	function toggleTheme() {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}

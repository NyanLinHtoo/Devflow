"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type LegalSection = {
	id: string;
	title: string;
	paragraphs: string[];
	note?: string;
};

type LegalShellProps = {
	title: string;
	updated: string;
	current: "terms" | "privacy";
	otherHref: string;
	otherLabel: string;
	sections: LegalSection[];
};

export default function LegalShell({
	title,
	updated,
	current,
	otherHref,
	otherLabel,
	sections,
}: LegalShellProps) {
	const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

	useEffect(() => {
		const headings = sections
			.map((section) => document.getElementById(section.id))
			.filter((heading): heading is HTMLElement => heading !== null);

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			{ rootMargin: "-96px 0px -70% 0px", threshold: 0 },
		);

		headings.forEach((heading) => observer.observe(heading));

		return () => observer.disconnect();
	}, [sections]);

	const wordCount = sections.reduce((total, section) => {
		const text = [section.title, ...section.paragraphs, section.note ?? ""]
			.join(" ")
			.trim();

		return total + text.split(/\s+/).filter(Boolean).length;
	}, 0);
	const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

	return (
		<main
			id="main"
			className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="lg:grid lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-12">
				<aside className="hidden lg:block print:hidden">
					<div className="sticky top-24">
						<nav aria-label="On this page">
							<p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
								On this page
							</p>

							<ol className="border-l border-border">
								{sections.map((section) => {
									const isActive = activeId === section.id;

									return (
										<li key={section.id}>
											<a
												href={`#${section.id}`}
												aria-current={isActive ? "location" : undefined}
												className={[
													"-ml-px block border-l-2 py-1.5 pl-3.5 text-sm transition-colors",
													isActive
														? "border-primary font-semibold text-primary"
														: "border-transparent text-muted-foreground hover:text-foreground",
												].join(" ")}>
												{section.title}
											</a>
										</li>
									);
								})}
							</ol>
						</nav>
					</div>
				</aside>

				<article className="min-w-0">
					<header>
						<p className="text-xs font-bold uppercase tracking-widest text-primary">
							Legal
						</p>

						<h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
							{title}
						</h1>

						<div className="mt-3 flex flex-wrap items-center gap-3 border-b border-border pb-6 text-sm text-muted-foreground">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground">
								<span className="size-1.5 rounded-full bg-primary" />
								Updated {updated}
							</span>

							<span>≈ {readingMinutes} min read</span>

							<Link
								href={otherHref}
								className="font-semibold text-primary hover:underline sm:ml-auto">
								{otherLabel} →
							</Link>
						</div>
					</header>

					<div>
						{sections.map((section, index) => (
							<section
								key={section.id}
								id={section.id}
								className="scroll-mt-24 border-b border-border py-8 last:border-b-0">
								<h2 className="group flex items-center gap-3 text-lg font-semibold tracking-tight">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-bold text-primary">
										{index + 1}
									</span>

									<span className="min-w-0">{section.title}</span>

									<a
										href={`#${section.id}`}
										aria-label={`Link to ${section.title}`}
										className="ml-auto text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
										#
									</a>
								</h2>

								<div className="mt-3 space-y-3">
									{section.paragraphs.map((paragraph, paragraphIndex) => (
										<p
											key={paragraphIndex}
											className="text-[15px] leading-7 text-muted-foreground">
											{paragraph}
										</p>
									))}

									{section.note ? (
										<div className="flex gap-3 rounded-lg border border-warning/25 bg-warning-surface p-3.5 text-sm text-warning">
											<AlertTriangle
												size={16}
												aria-hidden="true"
												className="mt-0.5 shrink-0"
											/>

											<p>{section.note}</p>
										</div>
									) : null}
								</div>
							</section>
						))}
					</div>

					<footer className="flex flex-wrap items-center gap-4 pt-6 text-sm text-muted-foreground">
						<Link
							href="/login"
							className="transition-colors hover:text-foreground">
							← Back to sign in
						</Link>

						<div className="ml-auto flex items-center gap-2">
							<Link
								href="/terms"
								aria-current={current === "terms" ? "page" : undefined}
								className={
									current === "terms"
										? "font-medium text-foreground"
										: "hover:text-foreground"
								}>
								Terms
							</Link>

							<span aria-hidden="true">·</span>

							<Link
								href="/privacy"
								aria-current={current === "privacy" ? "page" : undefined}
								className={
									current === "privacy"
										? "font-medium text-foreground"
										: "hover:text-foreground"
								}>
								Privacy
							</Link>
						</div>
					</footer>
				</article>
			</div>
		</main>
	);
}

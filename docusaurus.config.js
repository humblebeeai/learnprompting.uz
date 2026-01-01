const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require("remark-math");

async function createConfig() {
	const katex = (await import("rehype-katex")).default;
	return {
		title: "Learn Prompting: Your Guide to Communicating with AI",
		tagline:
			"A Free, Open Source Course on Communicating with Artificial Intelligence",
		url: "https://learnprompting.uz", // Updated to primary domain
		baseUrl: "/",
		onBrokenLinks: "warn", // Changed to warn to avoid build failures during migration
		onBrokenMarkdownLinks: "warn",
		favicon: "img/simple_ai.webp",
		organizationName: "humblebeeai", // Updated to new owner
		projectName: "Learn_Prompting",
		deploymentBranch: "gh-pages",
		trailingSlash: false,
		i18n: {
			defaultLocale: "uz",
			locales: ["uz", "en"],
			localeConfigs: {
				uz: {
					label: "O'zbekcha",
					direction: "ltr",
				},
				en: {
					label: "English",
					direction: "ltr",
				},
			},
		},
		scripts: [
			/*
					{
					src: "https://tag.clearbitscripts.com/v1/pk_5621ff511ea83a6ec015bee0a0b5dd79/tags.js",
					async: true,
					},
					*/
		],
		plugins: [
			[
				"@docusaurus/plugin-client-redirects",
				{
					redirects: [
						// { to: "/docs/basics/formalizing/page", from: "/docs/basics/standard_prompt" },
						// { to: "/docs/tooling/IDEs/intro/page", from: "/docs/IDEs/intro" },
						// { to: "/our_services", from: "/consulting" },
					],
				},
			],
			async function myPlugin(context, options) {
				return {
					name: "docusaurus-tailwindcss",
					configurePostCss(postcssOptions) {
						postcssOptions.plugins.push(require("tailwindcss"));
						postcssOptions.plugins.push(require("autoprefixer"));
						return postcssOptions;
					},
				};
			},
			// Posthog disabled for now or needs new key
			/*
					["posthog-docusaurus", {
					apiKey: process.env.POSTHOG_API_KEY || "DEV",
					appUrl: "https://app.posthog.com",
					enableInDevelopment: false,
					}],
					*/
		],

		presets: [
			[
				"classic",
				{
					/*
								gtag: { trackingID: "G-FV0C417KS8" },
								googleAnalytics: { trackingID: "G-FV0C417KS8" },
								*/
					docs: {
						admonitions: {
							tag: ":::",
							keywords: [
								"note",
								"tip",
								"info",
								"caution",
								"danger",
								"takeaways",
							],
						},
						sidebarPath: require.resolve("./sidebars.js"),
						// Point to the fork or upstream? For now upstream or local.
						editUrl: "https://github.com/humblebeeai/Learn_Prompting/tree/main",
						remarkPlugins: [
							math,
							(await import("remark-gfm")).default,

							[
								(await import("@benchmark-urbanism/remark-bibtex")).default,
								{ bibtexFile: "bibliography.bib" },
							],
							[
								(await import("@renatonagliati/remark-auto-glossary")).default,
								{ yamlFile: "glossary.yml" },
							],
						],
						rehypePlugins: [[katex, { strict: false }]],
					},
					theme: {
						customCss: require.resolve("./src/css/custom.css"),
					},
				},
			],
		],
		stylesheets: [
			{
				href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
				type: "text/css",
				integrity:
					"sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
				crossorigin: "anonymous",
				defer: true,
			},
			{ href: "https://fonts.googleapis.com", rel: "preconnect", async: true },
			{
				href: "https://fonts.gstatic.com",
				rel: "preconnect",
				crossorigin: "",
				async: true,
			},
			{
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap",
				async: true,
			},
		],
		themeConfig: {
			colorMode: {
				defaultMode: "light",
				disableSwitch: false,
				respectPrefersColorScheme: true,
			},
			metadata: [
				{
					name: "description",
					content:
						"Learn Prompting (O'zbekcha): Sun'iy intellekt bilan muloqot bo'yicha bepul va ochiq manbali kurs.",
				},
				{
					name: "keywords",
					content:
						"prompting, prompt engineering, learn prompting, AI, chatGPT, humblebeeai, uzbek, sun'iy intellekt",
				},
			],
			navbar: {
				title: "Learn Prompting",
				logo: {
					alt: "Learn Prompting Logo",
					src: "/img/simple_ai.webp",
				},
				items: [
					{
						type: "html",
						position: "left",
						value:
							'<div class="navbar-logos-container"><div class="navbar-logos-mobile"><a href="/" style="display: flex; align-items: center; text-decoration: none; color: inherit; gap: 10px;"><img src="/img/simple_ai.webp" alt="Learn Prompting" style="height: 28px;" /><div style="display: flex; flex-direction: column; line-height: 1.1;"><span style="font-weight: 700; font-size: 15px; letter-spacing: -0.02em;">Learn Prompting</span><span style="font-size: 10px; opacity: 0.6; font-weight: 500;">O\'zbekcha nashr</span></div></a></div><div class="navbar-logos-desktop"><a href="/" style="display: flex; align-items: center; text-decoration: none; color: inherit; gap: 12px;"><img src="/img/simple_ai.webp" alt="Learn Prompting" style="height: 32px;" /><div style="display: flex; flex-direction: column; justify-content: center;"><span style="font-weight: 700; font-size: 16px; line-height: 1.1;">Learn Prompting</span><span style="font-size: 11px; opacity: 0.6; font-weight: 500;">O\'zbekcha nashr</span></div></a><div style="width: 1px; height: 24px; background: currentColor; opacity: 0.1; margin: 0 16px;"></div><a href="https://humblebee.ai" target="_blank" style="display: flex; align-items: center; text-decoration: none; color: inherit; gap: 10px;"><img src="https://academy.humblebee.ai/images/logo/logo.svg" alt="HumblebeeAI" style="height: 32px;" /><div style="display: flex; flex-direction: column; justify-content: center;"><span style="font-weight: 700; font-size: 16px; line-height: 1.1;">HumblebeeAI</span><span style="font-size: 11px; opacity: 0.6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Yurituvchi</span></div></a></div></div>',
					},
					{
						to: "/about-project",
						label: "Loyiha haqida",
						position: "right",
					},
					{
						type: "dropdown",
						label: "Tillar",
						position: "right",
						className: "icon-link-language",
						items: [
							{
								label: "O'zbekcha",
								href: "/",
								target: "_self",
							},
							{
								label: "English (Coming Soon)",
								href: "/coming-soon",
								target: "_self",
							},
						],
					},


					{
						to: "/docs/intro",
						label: "Kursga kirish",
						position: "right",
						className: "navbar-docs-button",
					},
				],
			},
			footer: {
				style: "dark",
				links: [
					{
						title: "Navigation",
						items: [
							{
								label: "Dokumentatsiya",
								to: "/docs/intro",
							},
							{
								label: "Loyiha haqida",
								to: "/about-project",
							},
						],
					},
					{
						title: "Community",
						items: [
							{
								label: "GitHub",
								href: "https://github.com/humblebeeai/Learn_Prompting",
							},
							{
								label: "HumblebeeAI",
								href: "https://humblebee.ai",
							},
							{
								label: "AI Akademiyasi (Alohida loyiha)",
								href: "https://academy.humblebee.ai",
							},
						],
					},
					{
						title: "More",
						items: [
							{
								label: "Learn Prompting (English)",
								href: "https://learnprompting.org",
							},
							{
								label: "License (CC BY-NC-SA 4.0)",
								href: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
							},
						],
					},
				],
				copyright: `
          <div style="margin-top: 10px; font-size: 0.85em; opacity: 0.8; line-height: 1.6;">
            Asl loyiha: <a href="https://learnprompting.org" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">Learn Prompting</a>
            &nbsp;•&nbsp;
            Litsenziya: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">CC BY-NC-SA 4.0</a>
            &nbsp;•&nbsp;
            O'zbekcha nashr: <a href="https://humblebee.ai" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">HumblebeeAI</a>
            <br/>
            <span style="opacity: 0.7; font-size: 0.9em;">Rasmiy hamkorlikni anglatmaydi.</span>
          </div>
        `,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		},
		markdown: {
			mermaid: true,
		},
		themes: ["@docusaurus/theme-mermaid"],
	};
}

module.exports = createConfig;

// Name: Theme Switcher Component
// Author: Lukas Vendel Mann
// Version: 1.0.0
// Description: A component that allows the user to switch between themes
// Requires:
// - A HTML element for the user to click on
// - CSS :root variables with class names of the themes
//
// Props:
// - buttonId: The id of the button that the user clicks on to switch themes
// - iconMode: If the button uses icons or text
// - themes: An array containing the themes that will be used and optionally the icon for the theme
// - preferredThemes: Two themes that will be used to determine which theme to use from the user's browser
// - onThemeChange: A callback function that is called when the theme is changed
export default class ThemeSwitcher {
	constructor(
		buttonId = "theme-switcher",
		themes = [
			{ name: "light", label: "Light Theme" },
			{ name: "dark", label: "Dark Theme" },
		],
		preferredThemes = ["light", "dark"],
		onThemeChange = () => {}
	) {
		this.buttonId = buttonId;
		this.themes = themes;
		this.preferredThemes = preferredThemes;
		this.onThemeChange = onThemeChange;
		document.addEventListener("DOMContentLoaded", () => {
			this.init();
		});
	}
	// Function: getTheme
	// Description: Gets the current theme
	getTheme() {
		return document.documentElement.className;
	}
	// Function: setTheme
	// Description: Sets the current theme and saves it to local storage, then updates the button
	setTheme(theme) {
		if (this.themes.find((t) => t.name === theme)) {
			document.documentElement.className = theme;
			localStorage.setItem("siteTheme", theme);
			this.onThemeChange(theme);
		}
	}
	// Function: preferredTheme
	// Description: Gets the preferred theme from the user's browser
	preferredTheme() {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return this.preferredThemes[1];
		} else {
			return this.preferredThemes[0];
		}
	}
	// Function: updateButton
	// Description: Updates the button to show the current theme
	updateButton() {
		const button = document.getElementById(this.buttonId);
		if (button) {
			const theme = this.getTheme();
			const themeVars = this.themes.find((t) => t.name === theme);
			if (themeVars) {
				if (themeVars.label && themeVars.icon) {
					button.innerHTML = `<img src="${themeVars.icon}" alt="${themeVars.label}" />`;
				} else if (themeVars.materialIcon) {
					button.innerHTML = `<span class="material-symbols-outlined">${themeVars.materialIcon}</span>`;
				} else if (themeVars.label) {
					button.innerHTML = themeVars.label;
				} else {
					button.innerHTML = "Theme Switcher";
				}
			}
		}
	}
	// Function: validate
	// Description: Checks if all themes and preferred themes are valid
	validate() {
		if (this.themes.length < 2) {
			throw new Error("ThemeSwitcher: There must be at least two themes");
		}
		this.themes.forEach((theme) => {
			if (!theme.name) {
				throw new Error("ThemeSwitcher: Theme name cannot be empty");
			}
			if (theme.icon && theme.materialIcon) {
				throw new Error(
					"ThemeSwitcher: Theme cannot have both icon and materialIcon [theme: " + theme.name + "]"
				);
			} else if (theme.label && theme.materialIcon) {
				throw new Error(
					"ThemeSwitcher: Theme cannot have both label and materialIcon [theme: " + theme.name + "]"
				);
			}
		});
		if (this.preferredThemes.length < 2) {
			throw new Error("ThemeSwitcher: There must be at least two preferred themes");
		} else if (this.preferredThemes.length > 2) {
			console.warn(
				"ThemeSwitcher: There are more than two preferred themes (only the first two will be used)"
			);
		}
		this.preferredThemes.forEach((theme) => {
			if (!this.themes.find((t) => t.name === theme)) {
				throw new Error("ThemeSwitcher: Preferred theme does not exist [theme: " + theme + "]");
			}
		});
	}
	// Function: init
	// Description: Initializes the theme switcher
	init() {
		this.validate();
		const theme = localStorage.getItem("siteTheme");
		if (theme && this.themes.find((t) => t.name === theme)) {
			this.setTheme(theme);
		} else {
			this.setTheme(this.preferredTheme());
		}
		this.updateButton();
		const button = document.getElementById(this.buttonId);
		if (button) {
			button.addEventListener("click", () => {
				const theme = this.getTheme();
				const index = this.themes.findIndex((t) => t.name === theme);
				if (index !== -1) {
					this.setTheme(this.themes[(index + 1) % this.themes.length].name);
					this.updateButton();
				}
			});
		}
	}
}

import * as vscode from 'vscode';
import axios from 'axios';

let timeout: NodeJS.Timeout | undefined; // Declare timeout here

export function activate(context: vscode.ExtensionContext) {

	const editor = vscode.window.activeTextEditor;

	const selection = editor?.selection

	const url = 'http://localhost:8000/v1/engines/copilot-codex/completions';

	let timeoutId: NodeJS.Timeout | null = null;

	const provider: vscode.InlineCompletionItemProvider = {
		provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const linePrefix = document.lineAt(position).text.substr(0, position.character);
			const url = 'http://localhost:8000/v1/engines/copilot-codex/completions';

			console.log("Requesting completion for " + linePrefix);

			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			return new Promise((resolve, reject) => {
				timeoutId = setTimeout(() => {
					axios.post(url, {
						"prompt": "def sum_two_numbers",
						"stop": ["\n\n"],
						"max_tokens": 128,
						"temperature": 0
					}).then(function (response) {
						const suggestion = response.data.choices[0].text;
						console.log("suggested: " + suggestion);
						const inlineCompletionItem = new vscode.InlineCompletionItem(suggestion, new vscode.Range(position, position));
						resolve([inlineCompletionItem]);
					}).catch(function (error) {
						console.log(error);
						resolve([]);
					});
				}, 2000); // delay of 2000ms 
			});
		}
	}

	vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);

	}

	export function deactivate() { }
import * as vscode from 'vscode';
import axios from 'axios';

let timeout: NodeJS.Timeout | undefined; // Declare timeout here

export function activate(context: vscode.ExtensionContext) {

	// Code completion command

	const command = 'llama.codeCompletion';
	const editor = vscode.window.activeTextEditor;

	const selection = editor?.selection

	const url = 'http://localhost:8000/v1/engines/copilot-codex/completions';

	const commandHandler = () => {

		if (selection && !selection.isEmpty) {

			const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			const highlighted = editor.document.getText(selectionRange);

			console.log("Requesting completion for " + highlighted);

			axios.post(url, {
				"prompt": highlighted,
				"stop": ["\n\n"],
				"max_tokens": 128,
				"temperature": 0
			}).then(function (response) {
				const suggestion = response.data.choices[0].text
				console.log(suggestion);
				const finalText = highlighted + suggestion;
				editor.edit(editBuilder => {
					editBuilder.replace(selection, finalText);
				})
			}).catch(function (error) {
				console.log(error);
			});
		}
	};

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
						"prompt": linePrefix,
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
				}, 1500); // delay of 1500ms
			});
		}
	}

	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

		vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);

	}

	export function deactivate() { }
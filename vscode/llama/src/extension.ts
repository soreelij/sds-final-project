import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {

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

	context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));

}

export function deactivate() { }

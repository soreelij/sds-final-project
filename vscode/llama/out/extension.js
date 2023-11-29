"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
let timeout; // Declare timeout here
function activate(context) {
    // Code explain command
    const command = 'llama.explainCode';
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.selection;
    const url = 'http://localhost:8000/v1/engines/copilot-codex/completions';
    const commandHandler = () => {
        console.log("Command issued: Explain Code");
        if (selection && !selection.isEmpty) {
            const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);
            console.log("Requesting explanation for " + highlighted);
            axios_1.default.post(url, {
                "prompt": highlighted,
                "stop": ["\n\n"],
                "max_tokens": 150,
                "temperature": 0
            }).then(function (response) {
                const explanation = response.data.choices[0].text;
                console.log("Response: " + explanation);
                const finalText = explanation;
            }).catch(function (error) {
                console.log(error);
            });
        }
    };
    let timeoutId = null;
    const provider = {
        provideInlineCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            const url = 'http://localhost:8000/v1/engines/copilot-codex/completions';
            console.log("Requesting completion for " + linePrefix);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            return new Promise((resolve, reject) => {
                timeoutId = setTimeout(() => {
                    axios_1.default.post(url, {
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
                }, 2000); // delay of 2000ms 
            });
        }
    };
    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
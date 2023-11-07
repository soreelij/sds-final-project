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
function activate(context) {
    const command = 'llama.codeCompletion';
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.selection;
    const url = 'http://localhost:8000/v1/engines/copilot-codex/completions';
    const commandHandler = () => {
        if (selection && !selection.isEmpty) {
            const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);
            console.log("Requesting completion for " + highlighted);
            axios_1.default.post(url, {
                "prompt": highlighted,
                "stop": ["\n\n"],
                "max_tokens": 128,
                "temperature": 0
            }).then(function (response) {
                const suggestion = response.data.choices[0].text;
                console.log(suggestion);
                const finalText = highlighted + suggestion;
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, finalText);
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    };
    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
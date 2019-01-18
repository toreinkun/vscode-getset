'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let setterFuncString = function (selectedText: string): vscode.SnippetString {
    let propertyName = selectedText;
    let variableName = propertyName;
    if (variableName[0] === "_") {
        variableName = variableName.substr(1);
    }
    let upperVariableName = variableName[0].toUpperCase() + variableName.substr(1);
    let msg = new vscode.SnippetString();
    msg.appendText("\nfunction M:set").appendText(upperVariableName).appendText("(").appendText(variableName).appendText(")\n").
        appendText("	self.").appendText(propertyName).appendText(" = ").appendText(variableName).appendText("\nend\n");
    return msg;
};

let getterFuncString = function (selectedText: string): vscode.SnippetString {
    let propertyName = selectedText;
    let variableName = propertyName;
    if (variableName[0] === "_") {
        variableName = variableName.substr(1);
    }
    let upperVariableName = variableName[0].toUpperCase() + variableName.substr(1);
    let msg = new vscode.SnippetString();
    msg.appendText("\nfunction M:get").appendText(upperVariableName).appendText("()\n").
        appendText("	return self.").appendText(propertyName).appendText("\nend\n");
    return msg;
};

let findEmptyLine = function (document: vscode.TextDocument, startLine: number): number {
    while (true) {
        let textLine = document.lineAt(startLine);
        if (textLine.isEmptyOrWhitespace) {
            return startLine;
        }
        startLine++;
    }
    return startLine;
};

let findAllProperties = function (document: vscode.TextDocument): Array<string> {
    let results = Array<string>();

    let regex = /^M\.([_a-zA-Z0-9]+)\s*=/;

    for (let i = 0, lineCount = document.lineCount; i < lineCount; ++i) {
        let textLine = document.lineAt(i);
        if (textLine.isEmptyOrWhitespace) {
            continue;
        }
        let regexRes = regex.exec(textLine.text);
        if (!regexRes) {
            continue;
        }
        results.push(regexRes[1]);
    }

    return results;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "getset" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.hibiki.generateGetter', (textEditor, edit) => {
        let selection = textEditor.selection;
        if (!selection) {
            return; // there is not a selected text
        }
        let selectedText = textEditor.document.getText(selection);
        if (selectedText) {
            selectedText = selectedText.trim();
        }
        if (selectedText && selectedText !== "") {
            let msg = getterFuncString(selectedText);
            let position = new vscode.Position(findEmptyLine(textEditor.document, selection.end.line + 1), 0);
            textEditor.insertSnippet(msg, position);
        }
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.hibiki.generateSetter', (textEditor, edit) => {
        let selection = textEditor.selection;
        if (!selection) {
            return; // there is not a selected text
        }
        let selectedText = textEditor.document.getText(selection);
        if (selectedText) {
            selectedText = selectedText.trim();
        }
        if (selectedText && selectedText !== "") {
            let msg = setterFuncString(selectedText);
            let position = new vscode.Position(findEmptyLine(textEditor.document, selection.end.line + 1), 0);
            textEditor.insertSnippet(msg, position);
        }
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.hibiki.generateGetterSetter', (textEditor, edit) => {
        let selection = textEditor.selection;
        if (!selection) {
            return; // there is not a selected text
        }
        let selectedText = textEditor.document.getText(selection);
        if (selectedText) {
            selectedText = selectedText.trim();
        }
        if (selectedText && selectedText !== "") {
            let msg = setterFuncString(selectedText);
            let position = new vscode.Position(findEmptyLine(textEditor.document, selection.end.line + 1), 0);
            textEditor.insertSnippet(msg, position);

            msg = getterFuncString(selectedText);
            position.with(textEditor.selection.active.line, textEditor.selection.active.character);
            textEditor.insertSnippet(msg, position);
        }
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.hibiki.generateAllGetters', (textEditor, edit) => {
        let properties = findAllProperties(textEditor.document);
        properties.forEach(property => {
            let msg = getterFuncString(property);
            textEditor.insertSnippet(msg);
        });
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.hibiki.generateAllSetters', (textEditor, edit) => {
        let properties = findAllProperties(textEditor.document);
        properties.forEach(property => {
            let msg = setterFuncString(property);
            textEditor.insertSnippet(msg);
        });
    }));

    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.hibiki.generateAllGetterSetters', (textEditor, edit) => {
        let properties = findAllProperties(textEditor.document);
        properties.forEach(property => {
            let msg = setterFuncString(property);
            textEditor.insertSnippet(msg);
            msg = getterFuncString(property);
            textEditor.insertSnippet(msg);
        });
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
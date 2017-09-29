'use strict';

import * as vscode from 'vscode';
import { TaskFactory, TodoList  } from './todoProvider';

export function activate(context: vscode.ExtensionContext) {
    let labels: string[] = vscode.workspace.getConfiguration('dotodo').get("labels");

    let factory = new TaskFactory( labels );

    let todos: TodoList = new TodoList(factory);

    vscode.workspace.findFiles("**/*", '**/node_modules/*', 25).then( (files) => {
        files.forEach( ( file ) => {
            todos.scanFile(file);
        });
    });

    /* Command for jumping to a location in a specific file;
       Used as the "on click" function in the tree.

       not exposed in the palate. */
    context.subscriptions.push(vscode.commands.registerCommand('dotodo.jumpTo', (path: vscode.Uri, pos: vscode.Range) => {
        vscode.workspace.openTextDocument(path).then( (doc) => {
            vscode.window.showTextDocument(doc).then( (editor) => {
                let sel = new vscode.Selection(pos.end.line, 0, pos.end.line, 0);
                vscode.window.activeTextEditor.selection = sel;
                vscode.window.activeTextEditor.revealRange(pos, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
            });
        });
    }));

    vscode.window.registerTreeDataProvider("dotodoExplorer", todos);
}

export function deactivate() {
    // TODO: destroy tree view
}

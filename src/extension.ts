import * as vscode from 'vscode';
import * as Components from './components';
import * as General from './general';

export async function activate(context: vscode.ExtensionContext) {
    // Check if the workspace is an Angular project
    if (!await General.isAngularWorkspace()) {
        console.log('Not an Angular workspace. Extension not activated.');
        return;
    }

    vscode.workspace.onDidRenameFiles(async (event) => {
        for (const file of event.files) {
            if (await General.isAngularComponent(file.newUri.path)) {
                await Components.componentHandler(file);
            } else {
                await General.handler(file);
            }            
        }
    });
}



export function deactivate() { }
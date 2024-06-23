import * as vscode from 'vscode';
import * as Components from './components';
import * as General from './general';
import { getAngularRenamerSettings } from './settings';

export async function activate(context: vscode.ExtensionContext) {
    // Check if the workspace is an Angular project
    if (!await General.isAngularWorkspace()) {
        return;
    }
    
    vscode.workspace.onDidRenameFiles(async (event) => {
        const settings = getAngularRenamerSettings();
        for (const file of event.files) {
            if (await General.isAngularComponent(file.newUri.path)) {
                if (settings.renameComponents)
                     { 
                        await Components.componentHandler(file); }
                else {
                    return
                }
            } else {
                await General.handler(file);
            }
        }
    });
}



export function deactivate() { }
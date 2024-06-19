import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as Components from './components';
import { isAngularComponent } from './general';

export function activate(context: vscode.ExtensionContext) {
    // Listen for rename events
    vscode.workspace.onDidRenameFiles(async (event) => {
        for (const file of event.files) {
            if (await isAngularComponent(file.newUri.path)){
                vscode.window.showInformationMessage("is component");
                await Components.componentHandler(file);
            }            
        }
    });

    // Check workspace folders on extension activation
    Components.checkWorkspaceFolders();


    // Listen for workspace folder changes
    vscode.workspace.onDidChangeWorkspaceFolders(() => {

        Components.checkWorkspaceFolders();
    });
}

export function deactivate() { }

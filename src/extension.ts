import * as vscode from 'vscode';
import * as Components from './components';
import { isAngularComponent } from './general';
import  * as General  from './general';

export function activate(context: vscode.ExtensionContext) {
    // Listen for rename events
    vscode.workspace.onDidRenameFiles(async (event) => {
        for (const file of event.files) {
            if (await General.isAngularComponent(file.newUri.path)){
                await Components.componentHandler(file);
            } 
            else {
                await General.handler(file)
                
            }            
        }
    });

}

export function deactivate() { }

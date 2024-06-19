import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as Components from './components';
import { isAngularComponent,isAngularService } from './general';
import  * as General  from './general';

export function activate(context: vscode.ExtensionContext) {
    // Listen for rename events
    vscode.workspace.onDidRenameFiles(async (event) => {
        for (const file of event.files) {
            if (await isAngularComponent(file.newUri.path)){
                await Components.componentHandler(file);
            } 
            else {
                // General.renameAngularFiles(file.newUri.path)
                await General.handler(file)
                
                // await Components.componentHandler(file);
            }            
        }
    });

}

export function deactivate() { }

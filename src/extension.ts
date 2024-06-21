import * as vscode from 'vscode';
import * as Components from './components';
import  * as General  from './general';

export function activate(context: vscode.ExtensionContext) {
    // General.isAngularProject() is promise
    vscode.workspace.onDidRenameFiles(async (event) => {
        for (const file of event.files) {
            if (await General.isAngularComponent(file.newUri.path)){
                await Components.componentHandler(file);
            } 
            else {
                await General.handler(file);
                
            }            
        }
    });
    // General.isAngularProject().then((value)=>{
    //     if(value){
    //         vscode.workspace.onDidRenameFiles(async (event) => {
    //             for (const file of event.files) {
    //                 if (await General.isAngularComponent(file.newUri.path)){
    //                     await Components.componentHandler(file);
    //                 } 
    //                 else {
    //                     await General.handler(file)
                        
    //                 }            
    //             }
    //         });
    //     }
    //     else{
    //         // close extension on this workspace
    //     }
    // });
    // Listen for rename events
    

}

export function deactivate() { }

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Funzione per ottenere il contenuto del file e convertirlo in una stringa
function getWebviewContent(context: vscode.ExtensionContext, panel: vscode.WebviewPanel): string {
    const htmlPath = path.join(context.extensionPath, 'src', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'src', 'scripts.js'));
    const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

    const stylePathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'src', 'styles.css'));
    const styleUri = panel.webview.asWebviewUri(stylePathOnDisk);

    // Sostituisci i placeholder nel file HTML con gli URI effettivi
    htmlContent = htmlContent.replace(/<script src="scripts.js"><\/script>/, `<script src="${scriptUri}"></script>`);
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="styles.css">/, `<link rel="stylesheet" href="${styleUri}">`);

    return htmlContent;
}

// Attivazione dell'estensione
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('Camille.showChat', () => {
            // Crea e mostra il pannello della webview
            const panel = vscode.window.createWebviewPanel(
                'camilleChat', // Identificatore univoco per la webview
                'Camille Chat', // Titolo della webview
                vscode.ViewColumn.Two, // Posizione della webview nell'editor
                {
                    enableScripts: true, // Abilita l'esecuzione di JavaScript nella webview
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src'))] // Cartelle consentite per le risorse locali
                }
            );

            // Assegna il contenuto HTML alla webview
            panel.webview.html = getWebviewContent(context, panel);

            // Gestisci eventuali messaggi inviati dalla webview
            panel.webview.onDidReceiveMessage(
                message => {
                    vscode.window.showInformationMessage(`Messaggio dalla webview: ${message}`);
                },
                undefined,
                context.subscriptions
            );
        })
    );
}

// Disattiva l'estensione
export function deactivate() {}

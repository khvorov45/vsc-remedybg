import * as vscode from "vscode"
import * as childProcess from "child_process"

function remedyOpenFile() {
	if (vscode.window.activeTextEditor) {
		const path = vscode.window.activeTextEditor.document.uri.fsPath
		const line = vscode.window.activeTextEditor.selection.active.line
		const remedyCommand = `remedybg open-file ${path} ${line + 1}`
		console.log(remedyCommand)
		childProcess.exec(remedyCommand, (error, stdout, stderr) => {})
	}
}

export function activate(context: vscode.ExtensionContext) {
	
	let onFileSave: vscode.Disposable | null = null
	const removeOnFileSave = () => {
		if (onFileSave) {
			onFileSave.dispose()
		}
	}

	const openFileCommand = vscode.commands.registerCommand("vsc-remedybg.openfile", remedyOpenFile)
	context.subscriptions.push(openFileCommand)
	
	const installSyncCommand = vscode.commands.registerCommand("vsc-remedybg.installsync", () => {
		removeOnFileSave()
		onFileSave = vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => remedyOpenFile())
	})
	context.subscriptions.push(installSyncCommand)
	
	const uninstallSyncCommand = vscode.commands.registerCommand("vsc-remedybg.uninstallsync", removeOnFileSave)
	context.subscriptions.push(uninstallSyncCommand)
}

export function deactivate() {}

const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs"); // Import fs module for file system operations

// This method is called when the extension is activated
function activate(context) {
	// Register all commands
	let compileCobol = vscode.commands.registerCommand("cobol.compile", () => {
		const file = getCurrentFile();
		if (file) {
			compile(file);
		}
	});

	let runCobol = vscode.commands.registerCommand("cobol.run", () => {
		const file = getCurrentFile();
		if (file) {
			run(file);
		}
	});

	let compileAndRunCobol = vscode.commands.registerCommand(
		"cobol.compileAndRun",
		() => {
			const file = getCurrentFile();
			if (file) {
				compile(file, () => {
					run(file);
				});
			}
		}
	);

	// Add tab bar buttons for the commands
	context.subscriptions.push(compileCobol, runCobol, compileAndRunCobol);
}

function compile(file, callback) {
	const binPath = path.join(file.dir, "bin");
	createBinFolder(binPath, () => {
		const compileCommand = `cobc -x -o "${path.join(
			binPath,
			file.name
		)}.exe" "${file.fullPath}"`; // Wrap paths in quotes

		const terminal =
			vscode.window.terminals.find((t) => t.name === "COBOL") ||
			vscode.window.createTerminal("COBOL");
		terminal.show();

		// Use exec to capture the output and error
		exec(compileCommand, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Compilation failed: ${stderr}`);
				return; // Exit the function if there's an error
			}

			// If compilation succeeds
			vscode.window.showInformationMessage("Compilation successful.");
			if (callback) callback();
		});

		// Send the compile command to the terminal so the user can see it
		terminal.sendText(compileCommand);
	});
}

// Helper function to run the COBOL executable
function run(file) {
	const exePath = `& "${path.join(file.dir, "bin", `${file.name}.exe`)}"`; // Wrap the path in quotes and add &
	runTerminalCommand(exePath).catch((error) => {
		vscode.window.showErrorMessage(`Execution failed: ${error}`);
	});
}

// Helper function to create the bin folder if it doesn't exist
function createBinFolder(binPath, callback) {
	if (!fs.existsSync(binPath)) {
		fs.mkdirSync(binPath, { recursive: true }); // Create the folder recursively
	}
	if (callback) callback();
}

// Helper function to run commands in the VS Code terminal
function runTerminalCommand(command) {
	return new Promise((res) => {
		const terminal =
			vscode.window.terminals.find((t) => t.name === "COBOL") ||
			vscode.window.createTerminal("COBOL");
		terminal.show();
		terminal.sendText(command);
		// Resolve immediately after the command is sent
		res();
	});
}

// Helper function to get the current file's path, directory, and name
function getCurrentFile() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("No COBOL file open.");
		return null;
	}
	const fullPath = editor.document.fileName;
	const dir = path.dirname(fullPath);
	const name = path.basename(fullPath, path.extname(fullPath)); // without extension
	return { fullPath, dir, name };
}

module.exports = {
	activate,
};

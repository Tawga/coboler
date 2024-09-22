const vscode = require("vscode");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs"); // Import fs module for file system operations

// This method is called when the extension is activated
function activate(context) {
	// Register the compile command
	let compileCobol = vscode.commands.registerCommand("cobol.compile", () => {
		const file = getCurrentFile();
		if (file) {
			const binPath = path.join(file.dir, "bin");
			createBinFolder(binPath, () => {
				const compileCommand = `cobc -x -o ${path.join(
					binPath,
					file.name
				)}.exe ${file.fullPath}`;
				runTerminalCommand(compileCommand)
					.then(() => {
						vscode.window.showInformationMessage("Compilation successful.");
					})
					.catch((error) => {
						vscode.window.showErrorMessage(`Compilation failed: ${error}`);
					});
			});
		}
	});

	// Register the run command
	let runCobol = vscode.commands.registerCommand("cobol.run", () => {
		const file = getCurrentFile();
		if (file) {
			const exePath = path.join(file.dir, "bin", `${file.name}.exe`);
			runTerminalCommand(exePath);
		}
	});

	// Register the compile and run command
	let compileAndRunCobol = vscode.commands.registerCommand(
		"cobol.compileAndRun",
		() => {
			const file = getCurrentFile();
			if (file) {
				const binPath = path.join(file.dir, "bin");
				createBinFolder(binPath, () => {
					const compileCommand = `cobc -x -o ${path.join(
						binPath,
						file.name
					)}.exe ${file.fullPath}`;
					runTerminalCommand(compileCommand)
						.then(() => {
							const exePath = path.join(binPath, `${file.name}.exe`);
							return runTerminalCommand(exePath);
						})
						.catch((error) => {
							vscode.window.showErrorMessage(`Compilation failed: ${error}`);
						});
				});
			}
		}
	);

	// Add tab bar buttons for the commands
	context.subscriptions.push(compileCobol, runCobol, compileAndRunCobol);
}

// Helper function to create the bin folder if it doesn't exist
function createBinFolder(binPath, callback) {
	if (!fs.existsSync(binPath)) {
		fs.mkdirSync(binPath, { recursive: true }); // Create the folder recursively
	}
	if (callback) {
		callback();
	}
}

// Helper function to run commands in terminal
function runTerminalCommand(command) {
	return new Promise((resolve, reject) => {
		const terminal =
			vscode.window.terminals.find((t) => t.name === "COBOL") ||
			vscode.window.createTerminal("COBOL");
		terminal.show();
		terminal.sendText(command);

		// Use exec to run the command and capture the output
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(stderr || stdout);
				return;
			}
			// Check if the command executed successfully
			resolve(stdout);
		});

		// Listen for terminal process exit
		terminal.processId.then((pid) => {
			const checkExit = setInterval(() => {
				const running = vscode.window.terminals.some(
					(t) => t.processId === pid
				);
				if (!running) {
					clearInterval(checkExit);
					resolve(); // Resolve when terminal process is no longer running
				}
			}, 1000);
		});
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

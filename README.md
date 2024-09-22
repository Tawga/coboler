# COBOL Extension for Visual Studio Code

## Overview

This extension provides a simple interface for compiling and running COBOL programs directly from Visual Studio Code using the GnuCOBOL compiler. It features commands to compile, run, and compile & run COBOL programs, all while managing the output in a dedicated `bin` folder.

## Features

- **Compile COBOL Programs**: Compiles the currently open COBOL file into an executable.
- **Run COBOL Programs**: Executes the compiled COBOL program.
- **Compile & Run**: Combines both actions in one command.

## Installation

1. Ensure you have [Visual Studio Code](https://code.visualstudio.com/) installed.
2. Install GnuCOBOL on your system.
3. Download the `.vsix` package and install it using the command:

   ```bash
   code --install-extension your-extension-name-0.0.1.vsix
   ```

## Usage

1. Open a COBOL file in VS Code.
2. Use the commands in the top-right tab bar:
   - **Compile COBOL**: Compiles the current file.
   - **Run COBOL**: Runs the compiled executable.
   - **Compile & Run**: Compiles the file and runs it immediately if successful.

### Creating the Bin Folder

The extension automatically creates a `bin` folder in the same directory as your COBOL files if it doesn't already exist.

## Contributing

If you would like to contribute to this project, feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgements

- [GnuCOBOL](https://gnucobol.sourceforge.io/) for the COBOL compiler.
